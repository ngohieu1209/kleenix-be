import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BookingPackageEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class BookingPackageRepository extends Repository<BookingPackageEntity> {
  constructor(
    @InjectRepository(BookingPackageEntity)
    private readonly repository: Repository<BookingPackageEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }


}
