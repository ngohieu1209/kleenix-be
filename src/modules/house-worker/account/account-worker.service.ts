import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { HouseWorkerEntity } from 'src/models/entities';
import { HouseWorkerRepository } from 'src/models/repositories';
import { UpdateCustomerDto } from 'src/modules/customer/account/dto/update-user.dto';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';

@Injectable()
export class WorkerAccountService {
  constructor(
    private readonly houseWorkerRepository: HouseWorkerRepository,
  ) {}

  async getMe(userId: string): Promise<HouseWorkerEntity> {
    return await this.houseWorkerRepository.getHouseWorkerById(userId);
  }
  
  async updateInformation(userId: string, updateUser: UpdateCustomerDto) {
    const { name } = updateUser;
    const { affected } = await this.houseWorkerRepository.update({ id: userId }, {
      name
    })
    if(affected > 0) {
      return "Cập nhật thành công"
    }
    throw new BaseException(ERROR.UPDATE_FAIL)
  }
}