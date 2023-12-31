import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { HouseWorkerEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class HouseWorkerRepository extends Repository<HouseWorkerEntity> {
  constructor(
    @InjectRepository(HouseWorkerEntity)
    private readonly repository: Repository<HouseWorkerEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }


}
