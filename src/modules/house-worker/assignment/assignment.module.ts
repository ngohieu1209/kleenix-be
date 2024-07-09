import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { UploadLocalService } from 'src/providers/upload/local.service';

@Module({
  imports: [NotificationModule],
  controllers: [AssignmentController],
  providers: [AssignmentService, UploadLocalService],
})
export class AssignmentModule {}