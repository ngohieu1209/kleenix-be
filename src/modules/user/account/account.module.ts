import { Module } from '@nestjs/common';
import { UserAccountService } from './account.service';
import { UserAccountController } from './account.controller';

@Module({
  controllers: [UserAccountController],
  providers: [UserAccountService],
})
export class UserAccountModule {}