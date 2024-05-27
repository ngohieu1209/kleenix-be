import { Module } from '@nestjs/common';
import { ManageFeedbackController } from './admin-feedback.controller';
import { ManageFeedbackService } from './admin-feedback.service';

@Module({
  controllers: [ManageFeedbackController],
  providers: [ManageFeedbackService],
})
export class ManageFeedbackModule {}