import { Module } from '@nestjs/common';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { ManagePromotionController } from './admin-promotion.controller';
import { ManagePromotionService } from './admin-promotion.service';

@Module({
  controllers: [ManagePromotionController],
  providers: [ManagePromotionService, UploadLocalService],
})
export class ManagePromotionModule {}