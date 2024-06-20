import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import _ from 'lodash'
import { AssignmentRepository, BookingRepository } from 'src/models/repositories';
import { FilterAdminBookingDto } from './dto/query-admin-booking.dto';
import { UpdateStatusBookingDto } from './dto/update-status-booking.dto';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import { BOOKING_STATUS, PAYMENT_STATUS } from 'src/shared/enums/booking.enum';
import { BookingEntity, CustomerEntity, CustomerPromotionEntity, NotificationEntity } from 'src/models/entities';
import { fCurrency, getFirstEightChars } from 'src/shared/utils/utils';
import { NOTIFICATION_TYPE } from 'src/shared/enums/notification.enum';
import { NotificationGateway } from 'src/modules/notification/notification.gateway';

@Injectable()
export class ManageBookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notificationGateway: NotificationGateway,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource,
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
    if(updateStatusBooking.status === BOOKING_STATUS.CANCELLED_BY_KLEENIX) {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      let assignment = null;
      try {
        await this.databaseUtilService.executeTransaction(
          this.dataSource,
          async (queryRunner) => {
            const customerPromotionRepository = queryRunner.manager.getRepository(CustomerPromotionEntity);
            const customerRepository = queryRunner.manager.getRepository(CustomerEntity);
            if(booking.status === BOOKING_STATUS.PENDING || booking.status === BOOKING_STATUS.CONFIRMED || booking.status === BOOKING_STATUS.DELIVERY) {
              await queryRunner.manager.update(BookingEntity, booking.id, { status: BOOKING_STATUS.CANCELLED_BY_KLEENIX });
              const newNotification = new NotificationEntity();
              newNotification.booking = booking;
              newNotification.body = `Lịch đặt #${getFirstEightChars(booking.id)} đã bị huỷ bởi Kleenix`;
              newNotification.type = NOTIFICATION_TYPE.CANCELLED_BY_KLEENIX;
              newNotification.customer = booking.address.customer;
              await queryRunner.manager.save(newNotification);
              if(booking.customerPromotion.length > 0) {
                const customerPromotion = await customerPromotionRepository.findOne({ where: { id: booking.customerPromotion[0].id } });
                customerPromotion.isUsed = false;
                customerPromotion.booking = null;
                customerPromotion.priceDiscount = 0;
                await queryRunner.manager.update(CustomerPromotionEntity, customerPromotion.id, customerPromotion);
              }
              if(booking.paymentStatus === PAYMENT_STATUS.KPAY) {
                const customer = await customerRepository.findOne({ where: { id: booking.address.customer.id } });
                customer.kPay = Number(customer.kPay) + Number(booking.totalPrice);
                customer.usedPay = Number(customer.usedPay) - Number(booking.totalPrice);
                await queryRunner.manager.update(CustomerEntity, customer.id, customer);
                const newNotification = new NotificationEntity();
                newNotification.customer = customer;
                newNotification.booking = booking;
                newNotification.body = `Lịch đặt #${getFirstEightChars(booking.id)} đã bị huỷ, bạn được hoàn trả ${fCurrency(Number(booking.totalPrice))} vào KPay`;
                newNotification.type = NOTIFICATION_TYPE.REFUND;
                await queryRunner.manager.save(newNotification);
              }
              assignment = await this.assignmentRepository.getAssignmentByBooking(booking.id);
              if(assignment) {
                const newNotification = new NotificationEntity();
                newNotification.body = `Lịch đặt #${getFirstEightChars(booking.id)} đã bị huỷ bởi Kleenix`;
                newNotification.type = NOTIFICATION_TYPE.CANCELLED_BY_KLEENIX;
                newNotification.houseWorker = assignment.houseWorker;
                newNotification.booking = booking;
                await queryRunner.manager.save(newNotification);
              }
            }
          }
        );
        if(assignment) {
          await this.notificationGateway.refreshNotificationWorker(assignment.houseWorker.id);
        }
        await this.notificationGateway.refreshNotificationCustomer(booking.address.customer.id);
        return true;
      } catch (error) {
        console.log('admin-cancel-booking-error: ', error);
        throw new BadRequestException(error.message);
      }
    } else {
      const { affected } = await this.bookingRepository.update({ id: bookingId }, { status: updateStatusBooking.status });
      if (affected === 0) {
        throw new BaseException(ERROR.BOOKING_NOT_FOUND);
      }
      return true;
    }
  }
}