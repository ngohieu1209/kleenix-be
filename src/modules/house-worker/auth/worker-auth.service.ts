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

import type { JwtPayload } from 'src/shared/dtos';
import type { WorkerLoginRequestDto, WorkerLoginResponseDto } from './dto/worker-login.dto';
import {
  HouseWorkerRepository,
} from 'src/models/repositories';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class WorkerAuthService {
  private redisInstance: Redis;

  constructor(
    private readonly houseWorkerRepository: HouseWorkerRepository,
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

  async login(loginRequest: WorkerLoginRequestDto): Promise<any> {
    const { username, password } = loginRequest;
    const houseWorker = await this.houseWorkerRepository.getHouseWorkerWithPassword(username);
    
    const match = await compare(password, houseWorker.password);
        
    if (!match) {
      throw new BaseException(ERROR.WRONG_PHONE_OR_PASSWORD);
    }

    const accessToken = this.generateAccessToken({ userId: houseWorker.id });

    const signatureAccessToken = accessToken.split('.')[2];

    const refreshToken = this.generateRefreshToken({ userId: houseWorker.id });

    const signatureRefreshToken = refreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_PREFIX}${houseWorker.id}`,
      signatureAccessToken,
      signatureRefreshToken
    );
    
    return {
      user: houseWorker,
      token: {
        accessToken,
        refreshToken,
      }
    };
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
  ): Promise<WorkerLoginResponseDto> {
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
  
  async changePassword(houseWorkerId: string, oldPassword: string, newPassword: string) : Promise<boolean> {
    const houseWorker = await this.houseWorkerRepository.getHouseWorkerByIdWithPassword(houseWorkerId)
    if(!houseWorker) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    const match = await compare(oldPassword, houseWorker.password);
    if(!match) {
      throw new BaseException(ERROR.INVALID_PASSWORD);
    }
    const hashPassword = await hash(
      newPassword,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND
    );
    const { affected } = await this.houseWorkerRepository.update({ id: houseWorkerId }, {
      password: hashPassword
    })
    return affected > 0;
  }
}
