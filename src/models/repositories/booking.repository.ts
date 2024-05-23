import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BookingEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { QueryBookingDto } from 'src/modules/customer/booking/dto/query-booking.dto';
import { FilterAdminBookingDto } from 'src/modules/admin/booking/dto/query-admin-booking.dto';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class BookingRepository extends Repository<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly repository: Repository<BookingEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async getBookingById(bookingId: string): Promise<BookingEntity> {
    const booking = this.repository.createQueryBuilder('booking')
      .innerJoinAndSelect('booking.address', 'address')
      .innerJoinAndSelect('booking.bookingPackage', 'bookingPackage')
      .innerJoinAndSelect('bookingPackage.package', 'package')
      .innerJoinAndSelect('package.service', 'service')
      .leftJoinAndSelect('booking.bookingExtraService', 'bookingExtraService')
      .leftJoinAndSelect('bookingExtraService.extraService', 'extraService')
      .innerJoinAndSelect('address.customer', 'customer')
      .where('booking.id = :bookingId', { bookingId })
      .getOne();
    if (!booking) {
      throw new BaseException(ERROR.BOOKING_NOT_FOUND);
    }
    return booking;
  }
  
  async getBookingByCustomer(customerId: string, bookingId: string): Promise<BookingEntity> {
    const booking = await this.repository.findOne({ where: { id: bookingId, address: { customer: {id: customerId}} } });
    if (!booking) {
      throw new BaseException(ERROR.BOOKING_NOT_FOUND);
    }
    return transformToPlain<BookingEntity>(booking);
  }
  
  async getListBookingByCustomer(customerId: string, queryBooking: QueryBookingDto): Promise<any> {
    const { startDate, endDate, status } = queryBooking;
    const query = this.repository.createQueryBuilder('booking')
      .innerJoinAndSelect('booking.address', 'address')
      .innerJoinAndSelect('booking.bookingPackage', 'bookingPackage')
      .innerJoinAndSelect('bookingPackage.package', 'package')
      .innerJoinAndSelect('package.service', 'service')
      .leftJoinAndSelect('booking.bookingExtraService', 'bookingExtraService')
      .leftJoinAndSelect('bookingExtraService.extraService', 'extraService')
      .where('address.customer.id = :customerId', { customerId });
      if (startDate && endDate) {
        query.andWhere('DATE(booking.dateTime) BETWEEN :startDate AND :endDate', {
          startDate: startOfDay(new Date(startDate)),
          endDate: endOfDay(new Date(endDate)),
        });
      } else if(startDate) {
        query.andWhere('DATE(booking.dateTime) >= :startDate', {
          startDate: startOfDay(new Date(startDate)),
        });
      } else if(endDate) {
        query.andWhere('DATE(booking.dateTime) <= :endDate', {
          endDate: endOfDay(new Date(endDate)),
        });
      }
    if (status) {
      query.andWhere('booking.status IN (:...status)', { status });
    }
    const bookings = await query.getMany();
    return transformToPlain<BookingEntity[]>(bookings);
  }
  
  async getListBooking(filterBooking: FilterAdminBookingDto): Promise<any> {
    const { search, createdAt, startDate, endDate, status } = filterBooking;
    const query = this.repository.createQueryBuilder('booking')
      .innerJoinAndSelect('booking.address', 'address')
      .innerJoinAndSelect('booking.bookingPackage', 'bookingPackage')
      .innerJoinAndSelect('bookingPackage.package', 'package')
      .innerJoinAndSelect('package.service', 'service')
      .leftJoinAndSelect('booking.bookingExtraService', 'bookingExtraService')
      .leftJoinAndSelect('bookingExtraService.extraService', 'extraService')
      .innerJoinAndSelect('address.customer', 'customer')
      if(search) {
        query.andWhere('customer.name LIKE :search', { search: `%${search}%` });
      }
      if (createdAt) {
        query.andWhere('DATE(booking.createdAt) = :createdAt', { createdAt });
      }
      if (startDate && endDate) {
        query.andWhere('DATE(booking.dateTime) BETWEEN :startDate AND :endDate', {
          startDate: startOfDay(new Date(startDate)),
          endDate: endOfDay(new Date(endDate)),
        });
      } else if(startDate) {
        query.andWhere('DATE(booking.dateTime) >= :startDate', {
          startDate: startOfDay(new Date(startDate)),
        });
      } else if(endDate) {
        query.andWhere('DATE(booking.dateTime) <= :endDate', {
          endDate: endOfDay(new Date(endDate)),
        });
      }
      if (status) {
        query.andWhere('booking.status IN (:...status)', { status });
      }
      const bookings = await query.getMany();
      return transformToPlain<BookingEntity[]>(bookings);
  }
}
