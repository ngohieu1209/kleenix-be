import { Module } from '@nestjs/common';
import { WorkerAccountController } from './account-worker.controller';
import { WorkerAccountService } from './account-worker.service';

@Module({
  controllers: [WorkerAccountController],
  providers: [WorkerAccountService],
})
export class WorkerAccountModule {}