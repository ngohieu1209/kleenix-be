import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CustomerEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class CustomerRepository extends Repository<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isCustomerExist(phoneCode: string, phoneNumber: string): Promise <boolean> {
    const count = await this.count({ where: { 
      phoneCode,
      phoneNumber,
    } });
    return count > 0;
  }
  
  async getCustomerWithPassword(phoneCode: string, phoneNumber: string): Promise<CustomerEntity> {
    const user = await this.createQueryBuilder('customer')
      .andWhere('customer.phoneCode = :phoneCode', { phoneCode })
      .andWhere('customer.phoneNumber = :phoneNumber', { phoneNumber })
      .addSelect('customer.password')
      .getOne()
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return user;
  }
  
  async getCustomerByIdWithPassword(id: string): Promise<CustomerEntity> {
    const user = await this.createQueryBuilder('customer')
      .andWhere('customer.id = :id', { id })
      .addSelect('customer.password')
      .getOne()
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return user;
  }
  
  async getCustomerById(id: string): Promise<CustomerEntity> {
    const user = await this.findOne({ where: { id }});
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return transformToPlain<CustomerEntity>(user);
  }
  
  async amountCustomer(): Promise<number> {
    return await this.count({ where: { verify: true }});
  }
  
  async getTopCustomersSpend(): Promise<any> {
    const customers = await this.createQueryBuilder('customer')
      .where('customer.usedPay > 0')
      .orderBy('customer.usedPay', 'DESC')
      .limit(3)
      .getMany();
    return customers;
  }
}
