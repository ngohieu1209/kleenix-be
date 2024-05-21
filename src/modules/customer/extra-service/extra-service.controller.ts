import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { JwtPayload } from 'src/shared/dtos';
import { ExtraServiceService } from './extra-service.service';

@ApiTags('Customer | Extra Service')
@ApiBearerAuth()
@Controller('extra-service')
export class ExtraServiceController {
  constructor(private readonly extraServiceService: ExtraServiceService) { }
    
  @ApiOperation({
    summary: 'Danh sách tất cả dịch vụ phụ',
  })
  @Get('list')
  async getListExtraServices(
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return this.extraServiceService.getListExtraServices(data.userId);
  }
}