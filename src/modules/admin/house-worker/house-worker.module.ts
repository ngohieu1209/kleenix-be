import { Module } from '@nestjs/common';
import { ManageHouseWorkerController } from './house-worker.controller';
import { ManageHouseWorkerService } from './house-worker.service';

@Module({
  controllers: [ManageHouseWorkerController],
  providers: [ManageHouseWorkerService],
})
export class ManageHouseWorkerModule {}