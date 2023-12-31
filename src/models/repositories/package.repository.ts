import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PackageEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class PackageRepository extends Repository<PackageEntity> {
  constructor(
    @InjectRepository(PackageEntity)
    private readonly repository: Repository<PackageEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }


}
