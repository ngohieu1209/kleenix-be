import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import _ from 'lodash';
import { UserEntity } from 'src/models/entities';
import { UserRepository } from 'src/models/repositories';

@Injectable()
export class UserAccountService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getMe(userId: number): Promise<UserEntity> {
    return await this.userRepository.getUserById(userId);
  }
}