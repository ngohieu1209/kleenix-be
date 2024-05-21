import { Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import _ from 'lodash'
import { AddressRepository, CustomerRepository } from 'src/models/repositories';
import { AddressEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async createAddress(customerId: string, createAddress: CreateAddressDto): Promise<AddressEntity> {
    const customer = await this.customerRepository.getCustomerById(customerId);
    const checkAddressDefault = await this.addressRepository.isAddressDefaultCustomer(customerId);
  
    const newAddress = new AddressEntity();
    newAddress.customer = customer;
    _.assign(newAddress, createAddress);
    
    if(!checkAddressDefault) {
      newAddress.isDefault = true;
    }
    return await this.addressRepository.save(newAddress);
  }
  
  async getListAddress(customerId: string): Promise<any> {
    const addresses = await this.addressRepository.getListAddress(customerId);
    if(addresses.length > 0) {
      return _.sortBy(addresses, (address) => address.isDefault ? 0 : 1);
    }
    return [];
  }
  
  async deleteAddress(customerId: string, addressId: string): Promise<boolean> {
    const addressDefault = await this.addressRepository.getAddressDefault(customerId);
    if(addressDefault.id === addressId) {
      throw new BaseException(ERROR.CANT_DELETE_ADDRESS_DEFAULT);
    }
    const { affected } = await this.addressRepository.softDelete({ id: addressId, customer: { id: customerId }});
    if(affected === 0) {
      throw new BaseException(ERROR.ADDRESS_NOT_EXIST);
    }
    return true;
  }
  
  async setDefault(customerId: string, addressId: string): Promise<AddressEntity> {
    const address = await this.addressRepository.getAddress(customerId, addressId);
    const addressDefault = await this.addressRepository.getAddressDefault(customerId);
    if(addressDefault.id === addressId) {
      return address;
    }
    await this.addressRepository.update({ customer: { id: customerId } }, { isDefault: false });
    address.isDefault = true;
    return await this.addressRepository.save(address);
  }
}