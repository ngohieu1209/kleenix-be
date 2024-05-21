import { Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import _ from 'lodash'
import { BookingRepository } from 'src/models/repositories';
import { FilterAdminBookingDto } from './dto/query-admin-booking.dto';
import { UpdateStatusBookingDto } from './dto/update-status-booking.dto';

@Injectable()
export class ManageBookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
  ) {}
  
  async getListBooking(filterAdminBooking: FilterAdminBookingDto) {
    const bookings = await this.bookingRepository.getListBooking(filterAdminBooking);
    return bookings;
  }
  
  async getBooking(bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);
    return booking;
  }
  
  async updateStatusBooking(bookingId: string, updateStatusBooking: UpdateStatusBookingDto) {
    const { affected } = await this.bookingRepository.update({ id: bookingId }, { status: updateStatusBooking.status });
    if (affected === 0) {
      throw new BaseException(ERROR.BOOKING_NOT_FOUND);
    }
    return true;
  }
}