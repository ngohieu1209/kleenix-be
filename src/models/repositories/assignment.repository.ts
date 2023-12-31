import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AssignmentEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class AssignmentRepository extends Repository<AssignmentEntity> {
  constructor(
    @InjectRepository(AssignmentEntity)
    private readonly repository: Repository<AssignmentEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }


}
