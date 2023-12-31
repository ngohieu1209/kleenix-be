import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';

import { ExtraServiceEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { ManageExtraServiceService } from './admin-extra-service.service';
import { CreateExtraServiceDto } from './dto/create-extra-service.dto';
import { ParamExtraServiceIdDto } from './dto/param-extra-service.dto';
import { FilterExtraServiceDto } from './dto/query-extra-service.dto';
import { UpdateExtraServiceDto } from './dto/update-extra-service.dto';

@ApiTags('Admin | Extra Service')
@ApiBearerAuth()
@Controller('admin/extra-service')
@Roles([Role.Admin])
export class ManageExtraServiceController {
  constructor( private readonly manageExtraServiceService: ManageExtraServiceService ) {}
  
  @ApiOperation({
    summary: 'Create a extra service',
  })
  @Post('new')
  async createCourse(
    @Body() createExtraService: CreateExtraServiceDto, 
  ): Promise<ExtraServiceEntity> {
    return this.manageExtraServiceService.createExtraService(createExtraService);
  }
  
  @ApiOperation({
    summary: 'get information a extra service',
  })
  @Get('details/:extraServiceId')
  async getExtraService(
    @Param() paramExtraServiceId: ParamExtraServiceIdDto, 
  ): Promise<ExtraServiceEntity> {
    return this.manageExtraServiceService.getExtraService(paramExtraServiceId.extraServiceId);
  }
  
  @ApiOperation({
    summary: 'get list all extra services',
  })
  @Get('list')
  async getListExtraServices(
    @Query() filterExtraService: FilterExtraServiceDto, 
  ): Promise<PaginationResponse<ExtraServiceEntity>> {
    return await this.manageExtraServiceService.getListExtraServices(filterExtraService);
  }
  
  @ApiOperation({
    summary: 'update information extra service',
  })
  @Patch(':extraServiceId')
  async updateInformationCourse(
    @Param() paramExtraServiceId: ParamExtraServiceIdDto, 
    @Body() updateExtraService: UpdateExtraServiceDto,
  ): Promise<boolean> {
    return this.manageExtraServiceService.updateExtraService(paramExtraServiceId.extraServiceId, updateExtraService);
  }
  
  @ApiOperation({
    summary: 'delete a extra service',
  })
  @Delete(':extraServiceId')
  async deleteCourse(
    @Param() paramExtraServiceId: ParamExtraServiceIdDto, 
  ): Promise<boolean> {
    return this.manageExtraServiceService.deleteExtraService(paramExtraServiceId.extraServiceId);
  }
}