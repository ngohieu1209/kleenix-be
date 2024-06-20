import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdminManagerEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class AdminManagerRepository extends Repository<AdminManagerEntity> {
  constructor(
    @InjectRepository(AdminManagerEntity)
    private readonly repository: Repository<AdminManagerEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isAdminManagerExist(username: string): Promise <boolean> {
    const count = await this.count({ where: { username } });
    return count > 0;
  }
  
  async adminIdsExist() {
    const adminIds = await this.find({ select: ['id'] });
    return adminIds.map(admin => admin.id);
  }
  
  async getAdminManagerWithPassword(username: string): Promise<AdminManagerEntity> {
    const user = await this.createQueryBuilder('adminManager')
      .andWhere('adminManager.username = :username', { username })
      .addSelect('adminManager.password')
      .innerJoinAndSelect('adminManager.role', 'role')
      .getOne()
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return user;
  }
  
  async getAdminManagerById(id: string): Promise<AdminManagerEntity> {
    const user = await this.findOne({ where: { id }});
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return transformToPlain<AdminManagerEntity>(user);
  }
}
