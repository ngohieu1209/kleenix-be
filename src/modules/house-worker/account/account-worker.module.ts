import { Module } from '@nestjs/common';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { WorkerAccountController } from './account-worker.controller';
import { WorkerAccountService } from './account-worker.service';

@Module({
  controllers: [WorkerAccountController],
  providers: [WorkerAccountService, UploadLocalService],
})
export class WorkerAccountModule {}