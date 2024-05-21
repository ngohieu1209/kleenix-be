import { Injectable } from '@nestjs/common';

import _ from 'lodash';
import { ExtraServiceRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ExtraServiceService {
  constructor(
    private readonly extraServiceRepository: ExtraServiceRepository,
  ) {}

  async getListExtraServices(customerId: string): Promise<any> {
    const extraServices = await this.extraServiceRepository.getListExtraServiceActivate();
    return extraServices;
  }
}