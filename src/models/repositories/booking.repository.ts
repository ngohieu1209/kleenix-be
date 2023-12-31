import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BookingEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class BookingRepository extends Repository<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly repository: Repository<BookingEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }


}
