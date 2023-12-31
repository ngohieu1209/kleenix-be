import { Module } from '@nestjs/common';
import { ManageExtraServiceController } from './admin-extra-service.controller';
import { ManageExtraServiceService } from './admin-extra-service.service';

@Module({
  controllers: [ManageExtraServiceController],
  providers: [ManageExtraServiceService],
})
export class ManageExtraServiceModule {}