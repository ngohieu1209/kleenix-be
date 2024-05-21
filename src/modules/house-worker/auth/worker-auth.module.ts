import { Module } from '@nestjs/common';
import { WorkerAuthController } from './worker-auth.controller';
import { WorkerAuthService } from './worker-auth.service';


@Module({
  controllers: [WorkerAuthController],
  providers: [WorkerAuthService],
})
export class WorkerAuthModule {}
