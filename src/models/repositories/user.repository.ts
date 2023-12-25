import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isUserExist(phoneCode: string, phoneNumber: string): Promise <boolean> {
    const count = await this.count({ where: { 
      phoneCode,
      phoneNumber,
    } });
    return count > 0;
  }
  
  async getUserWithPassword(phoneCode: string, phoneNumber: string): Promise<UserEntity> {
    const user = await this.createQueryBuilder('user')
      .andWhere('user.phoneCode = :phoneCode', { phoneCode })
      .andWhere('user.phoneNumber = :phoneNumber', { phoneNumber })
      .addSelect('user.password')
      .getOne()
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return user;
  }
  
  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.findOne({ where: { id }});
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return transformToPlain<UserEntity>(user);
  }
}
