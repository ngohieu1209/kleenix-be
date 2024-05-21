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
import type { AdminLoginRequestDto, AdminLoginResponseDto } from './dto/admin-login.dto';
import {
  AdminManagerRepository,
} from 'src/models/repositories';
import { CustomerEntity } from 'src/models/entities';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminAuthService {
  private redisInstance: Redis;

  constructor(
    private readonly adminManagerRepository: AdminManagerRepository,
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

  async login(loginRequest: AdminLoginRequestDto): Promise<any> {
    const { username, password } = loginRequest;
    const adminManager = await this.adminManagerRepository.getAdminManagerWithPassword(username);
    
    const match = await compare(password, adminManager.password);
        
    if (!match) {
      throw new BaseException(ERROR.WRONG_PHONE_OR_PASSWORD);
    }
    
    const accessToken = this.generateAccessToken({ userId: adminManager.id, role: adminManager.role.name });

    const signatureAccessToken = accessToken.split('.')[2];

    const refreshToken = this.generateRefreshToken({ userId: adminManager.id, role: adminManager.role.name });

    const signatureRefreshToken = refreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_PREFIX}${adminManager.id}`,
      signatureAccessToken,
      signatureRefreshToken
    );
    
    return {
      user: adminManager,
      token: {
        accessToken,
        refreshToken,
      }
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
  ): Promise<AdminLoginResponseDto> {
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
