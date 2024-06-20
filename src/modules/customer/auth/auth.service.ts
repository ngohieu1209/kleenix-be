import { plainToClass } from 'class-transformer';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';
import type { Redis } from 'ioredis';
import { CACHE_CONSTANT } from 'src/shared/constants/cache.constant';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { ERROR } from 'src/shared/exceptions';
import { Role } from 'src/shared/enums/role.enum';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import RandomString from 'randomstring';
import type { JwtPayload } from 'src/shared/dtos';
import type { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import type {
  RegisterRequestDto,
  RegisterResponseDto,
} from './dto/register.dto';
import {
  CustomerRepository,
} from 'src/models/repositories';
import { CustomerEntity } from 'src/models/entities';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import { SmsService } from 'src/providers/sms/sms.service';
import { VerifyCodeForgetDto } from './dto/verify-forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private redisInstance: Redis;

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly apiConfigService: ApiConfigService,
    private readonly smsService: SmsService,
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.accessExpires', { infer: true }),
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.refreshExpires', { infer: true }),
    });
  }

  async login(loginRequest: LoginRequestDto): Promise<any> {
    const { phoneCode, phoneNumber, password } = loginRequest;
    const customer = await this.customerRepository.getCustomerWithPassword(phoneCode, phoneNumber);
    
    const match = await compare(password, customer.password);
        
    if (!match) {
      throw new BaseException(ERROR.WRONG_PHONE_OR_PASSWORD);
    }

    const accessToken = this.generateAccessToken({ userId: customer.id });

    const signatureAccessToken = accessToken.split('.')[2];

    const refreshToken = this.generateRefreshToken({ userId: customer.id });

    const signatureRefreshToken = refreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_PREFIX}${customer.id}`,
      signatureAccessToken,
      signatureRefreshToken
    );
    
    return {
      user: customer,
      token: {
        accessToken,
        refreshToken,
      }
    };
  }

  async register( registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { phoneCode, phoneNumber, name, password } = registerRequest;
    const checkCustomerExist = await this.customerRepository.isCustomerExist(phoneCode, phoneNumber);
    if (checkCustomerExist) {
      throw new BaseException(ERROR.USER_EXISTED);
    }

    const hashPassword = await hash(
      password,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND
    );
    const codeRandom = RandomString.generate({
      length: 4,
      charset: 'numeric'
    });
    const newCustomer = new CustomerEntity();
    newCustomer.phoneCode = phoneCode;
    newCustomer.phoneNumber = phoneNumber;
    newCustomer.name = name;
    newCustomer.password = hashPassword;
    newCustomer.code = codeRandom;
    try {
      const result = await this.customerRepository.save(newCustomer);
      await this.smsService.initiatePhoneNumberVerification(result.phoneNumber, codeRandom);
      return {
        id: result.id,
        phoneCode: result.phoneCode,
        phoneNumber: result.phoneNumber
      }
    } catch (error) {
      throw new BaseException(ERROR.REGISTER_FAIL);
    }
  }

  async logout(accessToken: string, userId: string): Promise<boolean> {
    const signature = accessToken.split('.')[2];
    const logoutResult = await this.redisInstance.hdel(
      `${CACHE_CONSTANT.SESSION_PREFIX}${userId}`,
      signature
    );

    return Boolean(logoutResult);
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string
  ): Promise<LoginResponseDto> {
    const signatureAccessToken = accessToken.split('.')[2];
    const signatureRefreshToken = refreshToken.split('.')[2];

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        payload = this.jwtService.decode(refreshToken) as JwtPayload;
        // await this.redisInstance.hdel(
        //   `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
        //   signatureAccessToken
        // );

        throw new BaseException(ERROR.REFRESH_TOKEN_EXPIRED);
      } else {
        throw new BaseException(ERROR.REFRESH_TOKEN_FAIL);
      }
    }

    const signatureRefreshTokenCache = await this.redisInstance.hget(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      signatureAccessToken
    );

    if (
      !signatureRefreshTokenCache ||
      signatureRefreshTokenCache !== signatureRefreshToken
    ) {
      throw new BaseException(ERROR.REFRESH_TOKEN_FAIL);
    }

    const newAccessToken = this.generateAccessToken({ userId: payload.userId });

    const newRefreshToken = this.generateRefreshToken({ userId: payload.userId });

    const newSignatureAccessToken = newAccessToken.split('.')[2];
    const newSignatureRefreshToken = newRefreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      newSignatureAccessToken,
      newSignatureRefreshToken
    );

    await this.redisInstance.hdel(
      `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
      signatureAccessToken
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
  
  async changePassword(customerId: string, oldPassword: string, newPassword: string) : Promise<boolean> {
    const customer = await this.customerRepository.getCustomerByIdWithPassword(customerId)
    if(!customer) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    const match = await compare(oldPassword, customer.password);
    if(!match) {
      throw new BaseException(ERROR.INVALID_PASSWORD);
    }
    const hashPassword = await hash(
      newPassword,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND
    );
    const { affected } = await this.customerRepository.update({ id: customerId }, {
      password: hashPassword
    })
    return affected > 0;
  }
  
  async verifyAccount(customerId: string, code: string) {
    const customer = await this.customerRepository.createQueryBuilder('customer')
      .where('customer.id = :customerId', { customerId })
      .addSelect('customer.code')
      .getOne();
    if(!customer) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    if(customer.verify) {
      throw new BaseException(ERROR.USER_VERIFIED);
    }
    if(customer.code !== code) {
      throw new BaseException(ERROR.INVALID_VERIFY_CODE);
    }
    customer.verify = true;
    const verifiedCustomer = await this.customerRepository.save(customer);
    return verifiedCustomer;
  }

  async resendOTP(customerId: string) {
    const customer = await this.customerRepository.createQueryBuilder('customer')
      .where('customer.id = :customerId', { customerId })
      .addSelect('customer.code')
      .getOne();
    if(!customer) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    if(customer.verify) {
      throw new BaseException(ERROR.USER_VERIFIED);
    }
    const codeRandom = RandomString.generate({
      length: 4,
      charset: 'numeric'
    });
    const { affected } = await this.customerRepository.update({ id: customer.id }, {
      code: codeRandom
    });
    if(affected <= 0) {
      throw new BaseException(ERROR.UPDATE_FAIL);
    }
    await this.smsService.initiatePhoneNumberVerification(customer.phoneNumber, codeRandom);
    return true;
  }
  
  async checkPhoneExist(phoneNumber: string): Promise<any> {
    const customer = await this.customerRepository.getCustomerWithPassword('84', phoneNumber);
    if(!customer.verify) {
      throw new BaseException(ERROR.ACCOUNT_NOT_VERIFIED);
    }
    const codeRandom = RandomString.generate({
      length: 4,
      charset: 'numeric'
    });
    const { affected } = await this.customerRepository.update({ id: customer.id }, {
      code: codeRandom
    });
    if(affected <= 0) {
      throw new BaseException(ERROR.UPDATE_FAIL);
    }
    await this.smsService.initiatePhoneNumberVerification(customer.phoneNumber, codeRandom);
    return true;
  }
  
  async verifyCodeForgetPassword(verifyCode: VerifyCodeForgetDto): Promise<any> {
    const { code, phoneNumber } = verifyCode;
    const customer = await this.customerRepository.createQueryBuilder('customer')
    .where('customer.phoneNumber = :phoneNumber', { phoneNumber })
    .addSelect('customer.code')
    .getOne();
    
    if(customer.code !== code) {
      throw new BaseException(ERROR.INVALID_VERIFY_CODE);
    }
    return true
  }
  
  async resetPassword(payload: ResetPasswordDto): Promise<any> {
    const { phoneNumber, newPassword, code } = payload;
    const customer = await this.customerRepository.createQueryBuilder('customer')
    .where('customer.phoneNumber = :phoneNumber', { phoneNumber })
    .andWhere('customer.code = :code', { code })
    .addSelect('customer.password')
    .getOne();
    if(!customer) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    const hashPassword = await hash(
      newPassword,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND
    );
    const { affected } = await this.customerRepository.update({ id: customer.id }, {
      password: hashPassword
    })
    return affected > 0;
  }
  
  async resendOTPForgotPassword(phoneNumber: string) {
    const customer = await this.customerRepository.createQueryBuilder('customer')
      .where('customer.phoneNumber = :phoneNumber', { phoneNumber })
      .addSelect('customer.code')
      .getOne();
    if(!customer) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    const codeRandom = RandomString.generate({
      length: 4,
      charset: 'numeric'
    });
    const { affected } = await this.customerRepository.update({ id: customer.id }, {
      code: codeRandom
    });
    if(affected <= 0) {
      throw new BaseException(ERROR.UPDATE_FAIL);
    }
    await this.smsService.initiatePhoneNumberVerification(customer.phoneNumber, codeRandom);
    return true;
  }
}
