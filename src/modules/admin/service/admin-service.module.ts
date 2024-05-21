import { Module } from '@nestjs/common';
import { ManageServiceService } from './admin-service.service';
import { ManageServiceController } from './admin-service.controller';
import { UploadLocalService } from 'src/providers/upload/local.service';

@Module({
  controllers: [ManageServiceController],
  providers: [ManageServiceService, UploadLocalService],
})
export class ManageServiceModule {}