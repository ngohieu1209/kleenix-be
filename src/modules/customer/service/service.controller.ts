import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { JwtPayload, ServiceIdDto } from 'src/shared/dtos';
import { ServiceService } from './service.service';

@ApiTags('Customer | Service')
@ApiBearerAuth()
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }
    
  @ApiOperation({
    summary: 'Danh sách tất cả dịch vụ',
  })
  @Get('list')
  async getListServices(
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return this.serviceService.getListServices(data.userId);
  }
  
  @ApiOperation({
    summary: 'Danh sách tất cả gói của dịch vụ',
  })
  @Get(':serviceId')
  async getListPackageService(
    @JwtDecodedData() data: JwtPayload,
    @Param() paramService: ServiceIdDto
  ): Promise<any> {
    return this.serviceService.getListPackageService(data.userId, paramService.serviceId);
  }
}