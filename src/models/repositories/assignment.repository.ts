import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AssignmentEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { QueryScheduleDto } from 'src/modules/house-worker/schedule/dto/query-schedule.dto';
import { endOfDay, startOfDay } from 'date-fns';
import { QueryAssignmentDto } from 'src/modules/house-worker/assignment/dto/query-assignment.dto';
import { FilterAdminBookingDto } from 'src/modules/admin/booking/dto/query-admin-booking.dto';

@Injectable()
export class AssignmentRepository extends Repository<AssignmentEntity> {
  constructor(
    @InjectRepository(AssignmentEntity)
    private readonly repository: Repository<AssignmentEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async getAssignmentById(assignmentId: string) {
    const query = this.repository.createQueryBuilder('assignment')
      .innerJoinAndSelect('assignment.booking', 'booking')
      .innerJoinAndSelect('booking.address', 'address')
      .innerJoinAndSelect('booking.bookingPackage', 'bookingPackage')
      .innerJoinAndSelect('bookingPackage.package', 'package')
      .innerJoinAndSelect('package.service', 'service')
      .leftJoinAndSelect('booking.bookingExtraService', 'bookingExtraService')
      .leftJoinAndSelect('bookingExtraService.extraService', 'extraService')
      .innerJoinAndSelect('address.customer', 'customer')
      .innerJoinAndSelect('assignment.houseWorker', 'houseWorker')
      .leftJoinAndSelect('booking.customerPromotion', 'customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
      .andWhere('assignment.id = :assignmentId', { assignmentId });
    const assignment = await query.getOne();
    if (!assignment) {
      throw new BaseException(ERROR.ASSIGNMENT_NOT_FOUND);
    }
    return transformToPlain<AssignmentEntity>(assignment);
  }

  async getAssignmentByHouseWorker(houseWorkerId: string, querySchedule: QueryScheduleDto) {
    const { startDate, endDate } = querySchedule;
    const query = this.repository.createQueryBuilder('assignment')
      .innerJoinAndSelect('assignment.booking', 'booking')
      .innerJoinAndSelect('booking.address', 'address')
      .innerJoinAndSelect('booking.bookingPackage', 'bookingPackage')
      .innerJoinAndSelect('bookingPackage.package', 'package')
      .innerJoinAndSelect('package.service', 'service')
      .leftJoinAndSelect('booking.bookingExtraService', 'bookingExtraService')
      .leftJoinAndSelect('bookingExtraService.extraService', 'extraService')
      .innerJoinAndSelect('address.customer', 'customer')
      .innerJoinAndSelect('assignment.houseWorker', 'houseWorker')
      .leftJoinAndSelect('booking.customerPromotion', 'customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
      .andWhere('houseWorker.id = :houseWorkerId', { houseWorkerId });
      if (startDate && endDate) {
        query.andWhere('DATE(assignment.startTime) BETWEEN :startDate AND :endDate', {
          startDate: startOfDay(new Date(startDate)),
          endDate: endOfDay(new Date(endDate)),
        });
      } else if(startDate) {
        query.andWhere('DATE(assignment.startTime) >= :startDate', {
          startDate: startOfDay(new Date(startDate)),
        });
      } else if(endDate) {
        query.andWhere('DATE(assignment.startTime) <= :endDate', {
          endDate: endOfDay(new Date(endDate)),
        });
      }
      
      const assignments = await query.getMany();
      return transformToPlain<AssignmentEntity[]>(assignments); 
  }
  
  async getAssignmentWithStatusByHouseWorker(houseWorkerId: string, queryAssignment: FilterAdminBookingDto) {
    const { startDate, endDate, status } = queryAssignment;
    const query = this.repository.createQueryBuilder('assignment')
      .innerJoinAndSelect('assignment.booking', 'booking')
      .innerJoinAndSelect('booking.address', 'address')
      .innerJoinAndSelect('booking.bookingPackage', 'bookingPackage')
      .innerJoinAndSelect('bookingPackage.package', 'package')
      .innerJoinAndSelect('package.service', 'service')
      .leftJoinAndSelect('booking.bookingExtraService', 'bookingExtraService')
      .leftJoinAndSelect('bookingExtraService.extraService', 'extraService')
      .innerJoinAndSelect('address.customer', 'customer')
      .innerJoinAndSelect('assignment.houseWorker', 'houseWorker')
      .leftJoinAndSelect('booking.customerPromotion', 'customerPromotion')
      .leftJoinAndSelect('customerPromotion.promotion', 'promotion')
      .andWhere('houseWorker.id = :houseWorkerId', { houseWorkerId });
      if (startDate && endDate) {
        query.andWhere('DATE(assignment.startTime) BETWEEN :startDate AND :endDate', {
          startDate: startOfDay(new Date(startDate)),
          endDate: endOfDay(new Date(endDate)),
        });
      } else if(startDate) {
        query.andWhere('DATE(assignment.startTime) >= :startDate', {
          startDate: startOfDay(new Date(startDate)),
        });
      } else if(endDate) {
        query.andWhere('DATE(assignment.startTime) <= :endDate', {
          endDate: endOfDay(new Date(endDate)),
        });
      }
      
      if (status) {
        query.andWhere('booking.status IN (:...status)', { status });
      }
      
      const assignments = await query.getMany();
      return transformToPlain<AssignmentEntity[]>(assignments); 
  }
  
  async getAssignmentByBooking(bookingId: string) {
    const assignment = await this.repository.findOne({ where: { booking: { id: bookingId } } });
    if (!assignment) {
      return null;
    }
    return transformToPlain<AssignmentEntity>(assignment);
  }
  
  async checkWorkSchedules(houseWorkerId: string, startTime: Date, endTime: Date) {
    const query = this.createQueryBuilder('assignment')
      .innerJoin('assignment.houseWorker', 'houseWorker')
      .where('houseWorker.id = :houseWorkerId', { houseWorkerId })
      .andWhere('((:startTime BETWEEN assignment.startTime AND assignment.endTime) OR (:endTime BETWEEN assignment.startTime AND assignment.endTime))', {
        startTime,
        endTime,
      })
      
    const count = await query.getCount();
    return count > 0;
  }
}
