import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { COMMON_CONSTANT } from './shared/constants/common.constant';
import { CronModule } from './modules/cron/cron.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { HttpExceptionFilter } from './shared/filters/exception.filter';
import { JwtAuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { ThrottlerBehindProxyGuard } from './shared/guards/throttler.guard';
import { ResponseTransformInterceptor } from './shared/interceptors/response.interceptor';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.modules';
import databaseConfig from './shared/configs/database.config';
import authConfig from './shared/configs/auth.config';
import appConfig from './shared/configs/app.config';
import fileConfig from './shared/configs/file.config';
import redisConfig from './shared/configs/redis.config';
import smsConfig from './shared/configs/sms.config';
import { DatabaseCommonModule } from './models/database-common';
import * as Customer from './modules/customer'
import * as Admin from './modules/admin'
import * as HouseWorker from './modules/house-worker'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const UserModules = Object.values(Customer);
const AdminModules = Object.values(Admin);
const HouseWorkerModules = Object.values(HouseWorker);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        redisConfig,
        authConfig,
        appConfig,
        fileConfig,
        smsConfig
      ],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRoot({
      ttl: COMMON_CONSTANT.THROTTLER.TTL,
      limit: COMMON_CONSTANT.THROTTLER.LIMIT,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) =>
        configService.getSqlConfig(),
    }),
    RedisModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => ({
        config: configService.getRedisConfig(),
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', 
      exclude: ['/api*']
    }),
    SharedModule,
    DatabaseCommonModule,
    HealthCheckModule,
    CronModule,
    ...UserModules,
    ...AdminModules,
    ...HouseWorkerModules,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
