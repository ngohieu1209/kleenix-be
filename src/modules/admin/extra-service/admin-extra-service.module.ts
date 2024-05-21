import { Module } from '@nestjs/common';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { ManageExtraServiceController } from './admin-extra-service.controller';
import { ManageExtraServiceService } from './admin-extra-service.service';

@Module({
  controllers: [ManageExtraServiceController],
  providers: [ManageExtraServiceService, UploadLocalService],
})
export class ManageExtraServiceModule {}