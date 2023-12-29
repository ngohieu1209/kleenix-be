import { Module } from '@nestjs/common';
import { ManageServiceService } from './admin-service.service';
import { ManageServiceController } from './admin-service.controller';

@Module({
  controllers: [ManageServiceController],
  providers: [ManageServiceService],
})
export class ManageServiceModule {}