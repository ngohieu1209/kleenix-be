import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ServiceEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class ServiceRepository extends Repository<ServiceEntity> {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly repository: Repository<ServiceEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isServiceExist(name: string): Promise <boolean> {
    const count = await this.count({ where: { name } });
    return count > 0;
  }
}
