import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { JwtDecodedData, Roles } from 'src/shared/decorators/auth.decorator';

import { AddressEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { AddressIdDto } from 'src/shared/dtos';
import { AddressService } from './address.service';
import { JwtPayload } from 'src/shared/dtos';
import { CreateAddressDto } from './dto/create-address.dto';
import { VerifyGuard } from 'src/shared/guards/verify.guard';

@ApiTags('Customer | Address')
@ApiBearerAuth()
@Controller('address')
@UseGuards(VerifyGuard)
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
    summary: 'set address default',
  })
  @Post('set-default')
  async setDefault(
    @JwtDecodedData() dataCustomer: JwtPayload,
    @Body() setAddressDefault: AddressIdDto, 
  ): Promise<AddressEntity> {
    return this.addressService.setDefault(dataCustomer.userId, setAddressDefault.addressId);
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