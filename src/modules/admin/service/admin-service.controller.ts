import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';

import { ManageServiceService } from './admin-service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ParamServiceIdDto } from './dto/param-service.dto';
import { ServiceEntity } from 'src/models/entities';
import { FilterServiceDto } from './dto/query-service.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('Admin | Service')
@ApiBearerAuth()
@Controller('admin/service')
@Roles([Role.Admin])
export class ManageServiceController {
  constructor( private readonly manageServiceService: ManageServiceService ) {}
  
  @ApiOperation({
    summary: 'Create a service',
  })
  @Post('new')
  async createService(
    @Body() createService: CreateServiceDto, 
  ): Promise<ServiceEntity> {
    return this.manageServiceService.createService(createService);
  }
  
  @ApiOperation({
    summary: 'get information a service',
  })
  @Get('details/:serviceId')
  async getService(
    @Param() paramServiceId: ParamServiceIdDto, 
  ): Promise<ServiceEntity> {
    return this.manageServiceService.getService(paramServiceId.serviceId);
  }
  
  @ApiOperation({
    summary: 'get list all services',
  })
  @Get('list')
  async getListServices(
    @Query() filterService: FilterServiceDto, 
  ): Promise<PaginationResponse<ServiceEntity>> {
    return await this.manageServiceService.getListServices(filterService);
  }
  
  @ApiOperation({
    summary: 'update information service',
  })
  @Patch(':serviceId')
  async updateService(
    @Param() paramServiceId: ParamServiceIdDto, 
    @Body() updateService: UpdateServiceDto,
  ): Promise<boolean> {
    return this.manageServiceService.updateService(paramServiceId.serviceId, updateService);
  }
  
  @ApiOperation({
    summary: 'delete a service',
  })
  @Delete(':serviceId')
  async deleteService(
    @Param() paramServiceId: ParamServiceIdDto, 
  ): Promise<boolean> {
    return this.manageServiceService.deleteService(paramServiceId.serviceId);
  }
}