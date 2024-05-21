import { Module } from '@nestjs/common';
import { SmsService } from 'src/providers/sms/sms.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SmsService],
})
export class AuthModule {}
