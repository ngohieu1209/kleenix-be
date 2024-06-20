import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingService } from '../customer/booking/booking.service';

@Injectable()
export class DefaultCronService {
  constructor(
    private readonly bookingService: BookingService
  ) {}
  
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleExpiredBooking() {
    try {
      await this.bookingService.expiredBooking();
      console.info(`Expired booking cron job run at ${new Date()}`)
    } catch (error) {
      console.info(`Expired booking cron job failed at ${new Date()} with error: ${error}`)
    }
  }
}
