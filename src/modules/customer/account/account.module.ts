import { Module } from '@nestjs/common';
import { CustomerAccountService } from './account.service';
import { CustomerAccountController } from './account.controller';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { UploadLocalService } from 'src/providers/upload/local.service';

@Module({
  imports: [NotificationModule],
  controllers: [CustomerAccountController],
  providers: [CustomerAccountService, UploadLocalService],
})
export class CustomerAccountModule {}