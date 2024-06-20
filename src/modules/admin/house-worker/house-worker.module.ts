import { Module } from '@nestjs/common';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { ManageHouseWorkerController } from './house-worker.controller';
import { ManageHouseWorkerService } from './house-worker.service';

@Module({
  controllers: [ManageHouseWorkerController],
  providers: [ManageHouseWorkerService, UploadLocalService],
})
export class ManageHouseWorkerModule {}