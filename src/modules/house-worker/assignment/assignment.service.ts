import { BadRequestException, Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';

import _ from 'lodash';
import { AssignmentEntity, BookingEntity } from 'src/models/entities';
import { BookingRepository, HouseWorkerRepository } from 'src/models/repositories';
import { FilterAdminBookingDto } from 'src/modules/admin/booking/dto/query-admin-booking.dto';
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly houseWorkerRepository: HouseWorkerRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource,
  ) {}
  
  async getListBookingPending(houseWorkerId: string, filterAdminBooking: FilterAdminBookingDto) {
    const listBookingPending = await this.bookingRepository.getListBooking(filterAdminBooking);
    // const listBookingPendingGroupByDate = _.groupBy(listBookingPending, 'dateTime');
    return listBookingPending;
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
}