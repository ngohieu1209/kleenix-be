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


}
