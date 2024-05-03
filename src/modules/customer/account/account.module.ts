import { Module } from '@nestjs/common';
import { CustomerAccountService } from './account.service';
import { CustomerAccountController } from './account.controller';

@Module({
  controllers: [CustomerAccountController],
  providers: [CustomerAccountService],
})
export class CustomerAccountModule {}