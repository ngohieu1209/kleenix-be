import { BadRequestException, Injectable } from '@nestjs/common';

import _ from 'lodash';
import { BookingEntity, BookingExtraServiceEntity, BookingPackageEntity, CustomerEntity, PackageEntity } from 'src/models/entities';
import { AddressRepository, BookingExtraServiceRepository, BookingRepository } from 'src/models/repositories';
import { BookingPackageRepository } from 'src/models/repositories/booking-package.repository';
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource, In } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly bookingExtraServiceRepository: BookingExtraServiceRepository,
    private readonly bookingPackageRepository: BookingPackageRepository,
    private readonly addressRepository: AddressRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource,
  ) {}
  
  async createBooking(customerId: string, createBooking: CreateBookingDto) {
    const { listPackage, extraServiceIds, totalPrice, dateTime, duration, note } = createBooking;
    try {
      const result = await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const bookingExtraServiceRepository = queryRunner.manager.getRepository(BookingExtraServiceEntity);
          const bookingPackageRepository = queryRunner.manager.getRepository(PackageEntity);
          const checkAddressDefault = await this.addressRepository.isAddressDefaultCustomer(customerId);
          if(!checkAddressDefault) {
            throw new BaseException(ERROR.ADDRESS_DEFAULT_NOT_FOUND);
          }
          const addressDefault = await this.addressRepository.getAddressDefault(customerId);
          const newBooking = new BookingEntity();
          newBooking.address = addressDefault;
          newBooking.totalPrice = totalPrice;
          newBooking.dateTime = dateTime;
          newBooking.duration = duration;
          newBooking.note = note;
          newBooking.status = BOOKING_STATUS.PENDING;
          
          const booking = await queryRunner.manager.save(newBooking);
          
          const packageIds = _.map(listPackage, 'packageId');
          
          const packages = await bookingPackageRepository.find({
            where: {
              id: In(packageIds)
            }
          });
          
          if(extraServiceIds.length > 0) {
            const extraServices = await bookingExtraServiceRepository.find({
              where: {
                id: In(extraServiceIds)
              }
            });
            const insertBulkExtraServices = _.map(extraServices, (extraService) => {
              return {
                extraService,
                booking: booking
              }
            })
            await queryRunner.manager.insert(
              BookingExtraServiceEntity,
              insertBulkExtraServices
            );
          }
          
          const insertBulkPackages = _.map(packages, (packageService) => {
            return {
              package: packageService,
              booking: booking,
              quantity: _.find(listPackage, { packageId: packageService.id }).quantity
            }
          })
          
          await queryRunner.manager.insert(
            BookingPackageEntity,
            insertBulkPackages
          );
          
          return booking;
        }
      );
      return result;
    } catch (error) {
      console.log('booking-error: ', error);
      throw new BadRequestException(error.message);
    }
  }
  
  async cancelBooking(customerId: string, bookingId: string) {
    const booking = await this.bookingRepository.getBookingByCustomer(customerId, bookingId);
    if(booking.status === BOOKING_STATUS.PENDING) {
      booking.status = BOOKING_STATUS.CANCELLED_BY_CUSTOMER;
    } else {
      throw new BadRequestException('Nhân viên đã nhận đơn booking. Hãy liên hệ với chúng tôi để được hỗ trợ');
    }
    await this.bookingRepository.save(booking);
    return true;
  }
  
  async getListBooking(customerId: string, queryBooking: QueryBookingDto) {
    const bookings = await this.bookingRepository.getListBookingByCustomer(customerId, queryBooking);
    return bookings;
  }
  
  async getBooking(customerId: string, bookingId: string) {
    const booking = await this.bookingRepository.getBookingByCustomer(customerId, bookingId);
    return booking;
  }
}