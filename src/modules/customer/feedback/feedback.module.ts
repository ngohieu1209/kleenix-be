import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [NotificationModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}