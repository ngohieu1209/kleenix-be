import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AddressEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class AddressRepository extends Repository<AddressEntity> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly repository: Repository<AddressEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isAddressDefaultCustomer(customerId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { customer: { id: customerId }, isDefault: true } });
    return count > 0;
  }
  
  async getListAddress(customerId: string): Promise<AddressEntity[]> {
    const listAddress = await this.repository.find({ where: { customer: { id: customerId } } });
    return transformToPlain<AddressEntity[]>(listAddress);
  }
}
