import { BadRequestException, Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';

import _ from 'lodash';
import { AssignmentEntity, BookingEntity, NotificationEntity } from 'src/models/entities';
import { AssignmentRepository, BookingRepository, CustomerRepository, HouseWorkerRepository, NotificationRepository } from 'src/models/repositories';
import { FilterAdminBookingDto } from 'src/modules/admin/booking/dto/query-admin-booking.dto';
import { NotificationGateway } from 'src/modules/notification/notification.gateway';
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';
import { NOTIFICATION_TYPE } from 'src/shared/enums/notification.enum';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { getFirstEightChars, transformPoint } from 'src/shared/utils/utils';
import { DataSource } from 'typeorm';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly houseWorkerRepository: HouseWorkerRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource,
  ) {}
  
  async getListBookingPending(houseWorkerId: string, filterAdminBooking: FilterAdminBookingDto) {
    let listBooking = []
    if(_.includes(filterAdminBooking.status, BOOKING_STATUS.PENDING)) {
      listBooking = await this.bookingRepository.getListBooking(filterAdminBooking);
    } else {
      const assignment = await this.assignmentRepository.getAssignmentWithStatusByHouseWorker(houseWorkerId, filterAdminBooking);
      listBooking = _.map(assignment, 'booking');
    }
    // const listBookingPendingGroupByDate = _.groupBy(listBookingPending, 'dateTime');
    return listBooking;
  }
  
  async acceptBooking(houseWorkerId: string, bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);
    if(booking.status !== BOOKING_STATUS.PENDING) {
      throw new BaseException(ERROR.BOOKING_NOT_PENDING);
    }
    const houseWorker = await this.houseWorkerRepository.getHouseWorkerById(houseWorkerId);
    
    try {
      const result = await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const checkSchedules = await this.assignmentRepository.checkWorkSchedules(houseWorkerId, booking.dateTime, addMinutes(booking.dateTime, booking.duration));
          if(checkSchedules) {
            throw new BaseException(ERROR.ASSIGNMENT_DUPLICATE_SCHEDULE);
          }
          const newAssignment = new AssignmentEntity();
          newAssignment.booking = booking;
          newAssignment.houseWorker = houseWorker;
          newAssignment.startTime = booking.dateTime;
          newAssignment.endTime = addMinutes(booking.dateTime, booking.duration);
          newAssignment.assignedTime = new Date();
          
          
          const assignment = await queryRunner.manager.save(newAssignment);
          
          booking.status = BOOKING_STATUS.CONFIRMED;
          await queryRunner.manager.save(booking);
          
          const newNotification = new NotificationEntity();
          newNotification.booking = booking;
          newNotification.type = NOTIFICATION_TYPE.CONFIRMED;
          newNotification.body = `Lịch đặt #${getFirstEightChars(booking.id)} đã được chấp nhận`;
          newNotification.customer = booking.address.customer;
          await queryRunner.manager.save(newNotification);
          return assignment;
        }
      );
      await this.notificationGateway.refreshNotificationCustomer(booking.address.customer.id);
      return result;
    } catch (error) {
      console.log('assignment-error: ', error);
      throw new BadRequestException(error.message);
    }
  }
  
  async updateStatusBooking(houseWorkerId: string, bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);
    if(booking.status !== BOOKING_STATUS.CONFIRMED && booking.status !== BOOKING_STATUS.DELIVERY) {
      throw new BaseException(ERROR.BOOKING_NOT_ACCEPTED);
    }
    if(booking.status === BOOKING_STATUS.CONFIRMED) {
      await this.bookingRepository.update({id: bookingId}, {status: BOOKING_STATUS.DELIVERY});
      const newNotification = new NotificationEntity();
      newNotification.booking = booking;
      newNotification.type = NOTIFICATION_TYPE.DELIVERY;
      newNotification.body = `Dịch vụ #${getFirstEightChars(booking.id)} của bạn đang trên đường đến`;
      newNotification.customer = booking.address.customer;
      await this.notificationRepository.save(newNotification);
      await this.notificationGateway.refreshNotificationCustomer(booking.address.customer.id);
      return { status: BOOKING_STATUS.DELIVERY };
    } else if(booking.status === BOOKING_STATUS.DELIVERY) {
      await this.bookingRepository.update({id: bookingId}, {status: BOOKING_STATUS.WORKING});
      const newNotification = new NotificationEntity();
      newNotification.booking = booking;
      newNotification.type = NOTIFICATION_TYPE.WORKING;
      newNotification.body = `Dịch vụ #${getFirstEightChars(booking.id)} của bạn đang được thực hiện`;
      newNotification.customer = booking.address.customer;
      await this.notificationRepository.save(newNotification);
      await this.notificationGateway.refreshNotificationCustomer(booking.address.customer.id);
      return { status: BOOKING_STATUS.WORKING };
    }
  }
  
  async completedBooking(houseWorkerId: string, bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);
    if(booking.status !== BOOKING_STATUS.WORKING) {
      throw new BaseException(ERROR.BOOKING_NOT_COMPLETED);
    }
    await this.bookingRepository.update({id: bookingId}, {status: BOOKING_STATUS.COMPLETED});
    const customer = await this.customerRepository.getCustomerById(booking.address.customer.id);
    await this.customerRepository.update({id: customer.id}, { kPoints: Number(customer.kPoints) + transformPoint(Number(booking.totalPrice))});
    const newNotification = new NotificationEntity();
    newNotification.booking = booking;
    newNotification.type = NOTIFICATION_TYPE.COMPLETED;
    newNotification.body = `Dịch vụ #${getFirstEightChars(booking.id)} của bạn đã hoàn thành`;
    newNotification.customer = customer;
    await this.notificationRepository.save(newNotification);
    await this.notificationGateway.refreshNotificationCustomer(booking.address.customer.id);
    return { status: BOOKING_STATUS.COMPLETED };
  }
}