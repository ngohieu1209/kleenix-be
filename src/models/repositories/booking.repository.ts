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
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';
import _ from 'lodash';

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
      .leftJoinAndSelect('booking.customerPromotion', 'customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
      .where('booking.id = :bookingId', { bookingId })
      .getOne();
    if (!booking) {
      throw new BaseException(ERROR.BOOKING_NOT_FOUND);
    }
    return booking;
  }
  
  async getBookingByCustomer(customerId: string, bookingId: string): Promise<BookingEntity> {
    const booking = await this.repository.findOne(
      { 
        where: { id: bookingId, address: { customer: {id: customerId}} } ,
        relations: ['customerPromotion']
      },
    );
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
      .leftJoinAndSelect('booking.customerPromotion', 'customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
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
      .leftJoinAndSelect('booking.customerPromotion', 'customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
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
  
  async bookingExpired(): Promise<any> {
    const query = this.repository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.address', 'address')
      .innerJoinAndSelect('address.customer', 'customer')
      .where('booking.status = :status', { status: BOOKING_STATUS.PENDING })
      .andWhere('booking.dateTime < :dateTime', { dateTime: new Date() });
    const bookings = await query.getMany();
    return bookings;
  }
  
  async amountBooking(): Promise<number> {
    return await this.count( { where: { status: BOOKING_STATUS.COMPLETED } });
  }
  
  async getTotalPriceThisYear(): Promise<number> {
    const query = this.repository.createQueryBuilder('booking')
      .select('SUM(booking.totalPrice)', 'totalPrice')
      .where('EXTRACT(YEAR FROM booking.dateTime) = EXTRACT(YEAR FROM CURRENT_DATE)')
      .andWhere('booking.status = :status', { status: BOOKING_STATUS.COMPLETED });
    const totalPrice = await query.getRawOne();
    return totalPrice.totalPrice;
  }
  
  async getTotalBookingCompletedThisYear(): Promise<number> {
    const query = this.repository.createQueryBuilder('booking')
      .select('COUNT(booking.id)', 'totalBooking')
      .where('EXTRACT(YEAR FROM booking.dateTime) = EXTRACT(YEAR FROM CURRENT_DATE)')
      .andWhere('booking.status = :status', { status: BOOKING_STATUS.COMPLETED });
    const totalBooking = await query.getRawOne();
    return totalBooking.totalBooking;
  }
  
  async getTotalPricesByYearAndMonth(): Promise<any> {
    const currentDate = new Date();
    const threeYearsAgo = new Date(new Date().setFullYear(currentDate.getFullYear() - 3));
    
    const query = this.repository.createQueryBuilder('booking')
      .select('EXTRACT(YEAR FROM booking.dateTime)', 'year')
      .addSelect('EXTRACT(MONTH FROM booking.dateTime)', 'month')
      .addSelect('SUM(booking.totalPrice)', 'totalPrice')
      .where('booking.status = :status', { status: BOOKING_STATUS.COMPLETED })
      .andWhere('booking.dateTime BETWEEN :threeYearsAgo AND :currentDate', {
        threeYearsAgo,
        currentDate,
      })
      .groupBy('year, month');
      // .groupBy('EXTRACT(YEAR FROM booking.dateTime)')
      // .addGroupBy('EXTRACT(MONTH FROM booking.dateTime)')
      // .orderBy('EXTRACT(YEAR FROM booking.dateTime)', 'ASC')
      // .addOrderBy('EXTRACT(MONTH FROM booking.dateTime)', 'ASC');
    const bookings = await query.getRawMany();
    const groupedByYear = _.groupBy(bookings, 'year');
    const result = _.map(groupedByYear, (value, key) => {
      // Tạo một mảng 12 phần tử, mặc định là null
      let monthlyTotals = Array(12).fill(null);
    
      // Điền giá trị vào các tháng có dữ liệu
      _.forEach(value, v => {
        const monthIndex = parseInt(v.month) - 1; // Chuyển tháng thành chỉ số mảng (0-11)
        monthlyTotals[monthIndex] = parseFloat(v.totalPrice);
      });
    
      return {
        year: key,
        data: [
          {
            name: 'Thu nhập',
            data: monthlyTotals
          }
        ]
      };
    });
    return result;
  }
  
  async getStatusOverview(): Promise<any> {
    const query = this.repository.createQueryBuilder('booking')
      .select('booking.status', 'status')
      .addSelect('COUNT(booking.id)', 'count')
      .groupBy('booking.status');
    const status = await query.getRawMany();
    return _.map(status, (s) => {
      return {
        label: s.status,
        value: Number(s.count)
      }
    });
  }
}
