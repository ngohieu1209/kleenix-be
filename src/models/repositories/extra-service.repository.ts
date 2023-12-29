import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraServiceEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class AdditionalServiceRepository extends Repository<ExtraServiceEntity> {
  constructor(
    @InjectRepository(ExtraServiceEntity)
    private readonly repository: Repository<ExtraServiceEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }


}
