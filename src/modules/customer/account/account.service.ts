import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { CustomerEntity } from 'src/models/entities';
import { CustomerRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { UpdateCustomerDto } from './dto/update-user.dto';

@Injectable()
export class CustomerAccountService {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  async getMe(userId: string): Promise<CustomerEntity> {
    return await this.customerRepository.getCustomerById(userId);
  }
  
  async updateInformation(userId: string, updateUser: UpdateCustomerDto) {
    const { phoneCode, phoneNumber, name } = updateUser;
    const { affected } = await this.customerRepository.update({ id: userId }, {
      phoneCode,
      phoneNumber,
      name
    })
    if(affected > 0) {
      return "Cập nhật thành công"
    }
    throw new BaseException(ERROR.UPDATE_FAIL)
  }
}