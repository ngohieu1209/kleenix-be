import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { AdminManagerEntity } from 'src/models/entities';
import { AdminManagerRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminManagerRepository: AdminManagerRepository,
  ) {}

  async getMe(userId: string): Promise<AdminManagerEntity> {
    return await this.adminManagerRepository.getAdminManagerById(userId);
  }
}