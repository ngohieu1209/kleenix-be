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

import type { JwtPayload } from './dto/jwt-payload.dto';
import type { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import type {
  RegisterRequestDto,
  RegisterResponseDto,
} from './dto/register.dto';
import {
  UserRepository,
} from 'src/models/repositories';
import { UserEntity } from 'src/models/entities';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  private redisInstance: Redis;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly apiConfigService: ApiConfigService
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

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const { phoneCode, phoneNumber, password } = loginRequest;
    const user = await this.userRepository.getUserWithPassword(phoneCode, phoneNumber);
    
    const match = await compare(password, user.password);
        
    if (!match) {
      throw new BaseException(ERROR.WRONG_PHONE_OR_PASSWORD);
    }

    const accessToken = this.generateAccessToken({ userId: user.id });

    const signatureAccessToken = accessToken.split('.')[2];

    const refreshToken = this.generateRefreshToken({ userId: user.id });

    const signatureRefreshToken = refreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_PREFIX}${user.id}`,
      signatureAccessToken,
      signatureRefreshToken
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async register( registerRequest: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { phoneCode, phoneNumber, name, password } = registerRequest;
    const checkUserExist = await this.userRepository.isUserExist(phoneCode, phoneNumber);
    if (checkUserExist) {
      throw new BaseException(ERROR.USER_EXISTED);
    }

    const hashPassword = await hash(
      password,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND
    );
    
    const newUser = new UserEntity();
    newUser.phoneCode = phoneCode;
    newUser.phoneNumber = phoneNumber;
    newUser.name = name;
    newUser.password = hashPassword;
    try {
      const result = await this.userRepository.save(newUser);
      return {
        id: result.id,
        phoneCode: result.phoneCode,
        phoneNumber: result.phoneNumber
      }
    } catch (error) {
      throw new BaseException(ERROR.REGISTER_FAIL);
    }
  }

  async logout(accessToken: string, userId: number): Promise<boolean> {
    const signature = accessToken.split('.')[2];
    const logoutResult = await this.redisInstance.hdel(
      `${CACHE_CONSTANT.SESSION_PREFIX}${userId}`,
      signature
    );

    return Boolean(logoutResult);
  }

  async revokeUser(userId: number): Promise<boolean> {
    const revokeResult = await this.redisInstance.del(
      `${CACHE_CONSTANT.SESSION_PREFIX}${userId}`
    );

    return Boolean(revokeResult);
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
        await this.redisInstance.hdel(
          `${CACHE_CONSTANT.SESSION_PREFIX}${payload.userId}`,
          signatureAccessToken
        );

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
}
