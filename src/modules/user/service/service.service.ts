import { Injectable } from '@nestjs/common';

import _ from 'lodash';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(

  ) {}

  async getListServices(userId: number): Promise<any> {
    
  }
}