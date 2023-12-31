import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BookingExtraServiceEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class BookingExtraServiceRepository extends Repository<BookingExtraServiceEntity> {
  constructor(
    @InjectRepository(BookingExtraServiceEntity)
    private readonly repository: Repository<BookingExtraServiceEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }


}
