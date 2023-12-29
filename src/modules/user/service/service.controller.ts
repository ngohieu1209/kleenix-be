import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { ServiceService } from './service.service';

@ApiTags('User | Service')
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
}