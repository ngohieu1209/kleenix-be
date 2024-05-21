import { Injectable } from '@nestjs/common';

import _ from 'lodash';
import { AssignmentRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import { QueryScheduleDto } from './dto/query-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
  ) {}
  
  async getListAssignment(houseWorkerId: string, querySchedule: QueryScheduleDto) {
    const assignments = await this.assignmentRepository.getAssignmentByHouseWorker(houseWorkerId, querySchedule);
    return assignments;
  }

}