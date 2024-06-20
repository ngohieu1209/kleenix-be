import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { ManageBookingController } from './admin-booking.controller';
import { ManageBookingService } from './admin-booking.service';

@Module({
  imports: [NotificationModule],
  controllers: [ManageBookingController],
  providers: [ManageBookingService],
})
export class ManageBookingModule {}