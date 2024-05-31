import { BadRequestException, Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';

import _ from 'lodash';
import { AssignmentEntity, BookingEntity } from 'src/models/entities';
import { AssignmentRepository, BookingRepository, CustomerRepository, HouseWorkerRepository } from 'src/models/repositories';
import { FilterAdminBookingDto } from 'src/modules/admin/booking/dto/query-admin-booking.dto';
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { transformPoint } from 'src/shared/utils/utils';
import { DataSource } from 'typeorm';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly houseWorkerRepository: HouseWorkerRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly assignmentRepository: AssignmentRepository,
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
          const bookingRepository = queryRunner.manager.getRepository(BookingEntity);

          const newAssignment = new AssignmentEntity();
          newAssignment.booking = booking;
          newAssignment.houseWorker = houseWorker;
          newAssignment.startTime = booking.dateTime;
          newAssignment.endTime = addMinutes(booking.dateTime, booking.duration);
          newAssignment.assignedTime = new Date();
          
          
          const assignment = await queryRunner.manager.save(newAssignment);
          
          booking.status = BOOKING_STATUS.CONFIRMED;
          await queryRunner.manager.save(booking);
          
          
          return assignment;
        }
      );
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
      return { status: BOOKING_STATUS.DELIVERY };
    } else if(booking.status === BOOKING_STATUS.DELIVERY) {
      await this.bookingRepository.update({id: bookingId}, {status: BOOKING_STATUS.WORKING});
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
    return { status: BOOKING_STATUS.COMPLETED };
  }
}