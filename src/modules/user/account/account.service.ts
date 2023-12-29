import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { UserEntity } from 'src/models/entities';
import { UserRepository } from 'src/models/repositories';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserAccountService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getMe(userId: number): Promise<UserEntity> {
    return await this.userRepository.getUserById(userId);
  }
  
  async updateInformation(userId: number, updateUser: UpdateUserDto) {
    const { phoneCode, phoneNumber, name } = updateUser;
    const { affected } = await this.userRepository.update({ id: userId }, {
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