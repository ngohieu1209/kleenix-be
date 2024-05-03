import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { JwtDecodedData, Roles } from 'src/shared/decorators/auth.decorator';

import { AddressEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { AddressIdDto } from 'src/shared/dtos';
import { AddressService } from './address.service';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@ApiTags('Customer | Address')
@ApiBearerAuth()
@Controller('address')
export class AddressController {
  constructor( private readonly addressService: AddressService ) {}
  
  @ApiOperation({
    summary: 'Create a address',
  })
  @Post('new')
  async createAddress(
    @JwtDecodedData() dataCustomer: JwtPayload,
    @Body() createAddress: CreateAddressDto, 
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(dataCustomer.userId, createAddress);
  }
  
  @ApiOperation({
    summary: 'get list all address',
  })
  @Get('list')
  async getListAddress(
    @JwtDecodedData() dataCustomer: JwtPayload,
  ): Promise<any> {
    return await this.addressService.getListAddress(dataCustomer.userId);
  }
  
  @ApiOperation({
    summary: 'delete a address',
  })
  @Delete(':addressId')
  async deleteAddress(
    @JwtDecodedData() dataCustomer: JwtPayload,
    @Param() paramAddressId: AddressIdDto, 
  ): Promise<boolean> {
    return this.addressService.deleteAddress(dataCustomer.userId, paramAddressId.addressId);
  }
}