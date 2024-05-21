import { Module } from '@nestjs/common';
import { ManageBookingController } from './admin-booking.controller';
import { ManageBookingService } from './admin-booking.service';

@Module({
  controllers: [ManageBookingController],
  providers: [ManageBookingService],
})
export class ManageBookingModule {}