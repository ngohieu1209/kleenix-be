import { BadRequestException, Injectable } from '@nestjs/common';

import _ from 'lodash';
import { BookingEntity, BookingExtraServiceEntity, BookingPackageEntity, CustomerEntity, CustomerPromotionEntity, ExtraServiceEntity, NotificationEntity, PackageEntity } from 'src/models/entities';
import { AddressRepository, BookingRepository, CustomerPromotionRepository, CustomerRepository } from 'src/models/repositories';
import { NotificationGateway } from 'src/modules/notification/notification.gateway';
import { BOOKING_STATUS, PAYMENT_STATUS } from 'src/shared/enums/booking.enum';
import { NOTIFICATION_TYPE } from 'src/shared/enums/notification.enum';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { fCurrency, getFirstEightChars, transformPoint } from 'src/shared/utils/utils';
import { DataSource, In } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly notificationGateway: NotificationGateway,
    private readonly customerPromotionRepository: CustomerPromotionRepository,
    private readonly addressRepository: AddressRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource,
  ) {}
  
  async createBooking(customerId: string, createBooking: CreateBookingDto) {
    const { listPackage, extraServiceIds, totalPrice, dateTime, duration, note, paymentStatus, promotionId } = createBooking;
    try {
      const result = await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          let booking = null;
          const extraServiceRepository = queryRunner.manager.getRepository(ExtraServiceEntity);
          const packageRepository = queryRunner.manager.getRepository(PackageEntity);
          
          const checkAddressDefault = await this.addressRepository.isAddressDefaultCustomer(customerId);
          if(!checkAddressDefault) {
            throw new BaseException(ERROR.ADDRESS_DEFAULT_NOT_FOUND);
          }
          const addressDefault = await this.addressRepository.getAddressDefault(customerId);
          const newBooking = new BookingEntity();
          newBooking.address = addressDefault;
          newBooking.totalPrice = Number(totalPrice);
          newBooking.dateTime = new Date(dateTime);
          newBooking.duration = duration;
          newBooking.note = note;
          newBooking.status = BOOKING_STATUS.PENDING;
          newBooking.paymentStatus = paymentStatus;
          
          booking = await queryRunner.manager.save(newBooking);
          
          const packageIds = _.map(listPackage, 'packageId');
          
          const packages = await packageRepository.find({
            where: {
              id: In(packageIds)
            }
          });
          if(extraServiceIds.length > 0) {
            const extraServices = await extraServiceRepository.find({
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
          
          if(promotionId) {
            const customerPromotion = await this.customerPromotionRepository.getPromotionClaimed(customerId, promotionId);
            customerPromotion.booking = booking;
            customerPromotion.isUsed = true;
            customerPromotion.priceDiscount = Number(customerPromotion.promotion.discount);
            await queryRunner.manager.update(CustomerPromotionEntity, customerPromotion.id, customerPromotion);
            booking.totalPrice = Number(booking.totalPrice) - Number(customerPromotion.promotion.discount);
            booking = await queryRunner.manager.save(booking as BookingEntity);
          }
          
          if(paymentStatus === PAYMENT_STATUS.KPAY) {
            const customer = await this.customerRepository.getCustomerById(customerId);
            if(Number(customer.kPay) < Number(booking.totalPrice)) {
              throw new BaseException(ERROR.KPAY_NOT_ENOUGH);
            }
            customer.kPay = Number(customer.kPay) - Number(booking.totalPrice);
            customer.usedPay = Number(customer.usedPay) + Number(booking.totalPrice);
            await queryRunner.manager.update(CustomerEntity, customer.id, customer);
          }
          
          const newNotification = new NotificationEntity();
          newNotification.booking = booking;
          newNotification.body = `Đơn booking mới. Mã đơn: #${getFirstEightChars(booking.id)}`;
          newNotification.type = NOTIFICATION_TYPE.NEW_BOOKING;
          await queryRunner.manager.save(newNotification);
          return booking;
        }
      );
      await this.notificationGateway.refreshNotificationAdmin();
      return result;
    } catch (error) {
      console.log('booking-error: ', error);
      throw new BadRequestException(error.message);
    }
  }
  
  async cancelBooking(customerId: string, bookingId: string) {
    const booking = await this.bookingRepository.getBookingByCustomer(customerId, bookingId);

    try {
      await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const customerPromotionRepository = queryRunner.manager.getRepository(CustomerPromotionEntity);
          const customerRepository = queryRunner.manager.getRepository(CustomerEntity);
          const notificationRepository = queryRunner.manager.getRepository(NotificationEntity);
          
          if(booking.status === BOOKING_STATUS.PENDING) {
            await queryRunner.manager.update(BookingEntity, booking.id, { status: BOOKING_STATUS.CANCELLED_BY_CUSTOMER });
            if(booking.customerPromotion.length > 0) {
              const customerPromotion = await customerPromotionRepository.findOne({ where: { id: booking.customerPromotion[0].id } });
              customerPromotion.isUsed = false;
              customerPromotion.booking = null;
              customerPromotion.priceDiscount = 0;
              await queryRunner.manager.update(CustomerPromotionEntity, customerPromotion.id, customerPromotion);
            }
            if(booking.paymentStatus === PAYMENT_STATUS.KPAY) {
              const customer = await customerRepository.findOne({ where: { id: customerId } });
              customer.kPay = Number(customer.kPay) + Number(booking.totalPrice);
              customer.usedPay = Number(customer.usedPay) - Number(booking.totalPrice);
              await queryRunner.manager.update(CustomerEntity, customer.id, customer);
              const newNotification = new NotificationEntity();
              newNotification.booking = booking;
              newNotification.body = `Bạn đã huỷ đơn booking #${getFirstEightChars(booking.id)}. Hoàn trả ${fCurrency(Number(booking.totalPrice))} vào KPAY`;
              newNotification.type = NOTIFICATION_TYPE.REFUND;
              newNotification.customer = customer;
              await queryRunner.manager.save(newNotification);
            }
            const newNotification = new NotificationEntity();
            newNotification.booking = booking;
            newNotification.body = `Khách hàng đã huỷ lịch đặt: #${getFirstEightChars(booking.id)}`;
            newNotification.type = NOTIFICATION_TYPE.CANCELLED_BY_CUSTOMER;
            await queryRunner.manager.save(newNotification);
          } else {
            throw new BadRequestException('Nhân viên đã nhận đơn booking. Hãy liên hệ với chúng tôi để được hỗ trợ');
          }
        }
      );
      await this.notificationGateway.refreshNotificationCustomer(customerId);
      return true;
    } catch (error) {
      console.log('cancel-booking-error: ', error);
      throw new BadRequestException(error.message);
    }
  }
  
  async getListBooking(customerId: string, queryBooking: QueryBookingDto) {
    const bookings = await this.bookingRepository.getListBookingByCustomer(customerId, queryBooking);
    return bookings;
  }
  
  async getBooking(customerId: string, bookingId: string) {
    const booking = await this.bookingRepository.getBookingByCustomer(customerId, bookingId);
    return booking;
  }
  
  async expiredBooking() {
    try {
      await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const customerRepository = queryRunner.manager.getRepository(CustomerEntity);
          const listBookingExpired = await this.bookingRepository.bookingExpired();
          
          for(const booking of listBookingExpired) {
            await queryRunner.manager.update(BookingEntity, booking.id, { status: BOOKING_STATUS.CANCELLED_BY_KLEENIX });
            if(booking.paymentStatus === PAYMENT_STATUS.KPAY) {
              const customer = await customerRepository.findOne({ where: { id: booking.address.customer.id } });
              customer.kPay = Number(customer.kPay) + Number(booking.totalPrice);
              customer.usedPay = Number(customer.usedPay) - Number(booking.totalPrice);
              await queryRunner.manager.update(CustomerEntity, customer.id, customer);
              const newNotification = new NotificationEntity();
              newNotification.booking = booking;
              newNotification.body = `Đơn booking #${getFirstEightChars(booking.id)} đã hết hạn. Hoàn trả ${fCurrency(Number(booking.totalPrice))} vào KPAY`;
              newNotification.type = NOTIFICATION_TYPE.REFUND;
              newNotification.customer = customer;
              await queryRunner.manager.save(newNotification);
            }
            const newNotification = new NotificationEntity();
            newNotification.booking = booking;
            newNotification.body = `Đơn booking #${getFirstEightChars(booking.id)} đã hết hạn`;
            newNotification.type = NOTIFICATION_TYPE.CANCELLED_BY_KLEENIX;
            await queryRunner.manager.save(newNotification);
          }
        }
      );
      return true;
    } catch (error) {
      console.log('expired-booking-error: ', error);
      throw new BadRequestException(error.message);
    }
  }
}