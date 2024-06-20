import { Module } from '@nestjs/common';
import { BookingModule } from '../customer';

import { DefaultCronService } from './default.cron.service';

@Module({
  imports: [BookingModule],
  providers: [DefaultCronService],
})
export class CronModule {}
