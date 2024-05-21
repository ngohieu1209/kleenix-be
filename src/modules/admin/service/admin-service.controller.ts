import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';

import { ManageServiceService } from './admin-service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceIdDto } from 'src/shared/dtos';
import { ServiceEntity } from 'src/models/entities';
import { FilterServiceDto } from './dto/query-service.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidator } from 'src/shared/validators/image-file.validator';

@ApiTags('Admin | Service')
@ApiBearerAuth()
@Controller('admin/service')
@Roles([Role.Admin])
export class ManageServiceController {
  constructor( private readonly manageServiceService: ManageServiceService ) {}
  
  @ApiOperation({
    summary: 'Create a service',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @Post('new')
  async createService(
    @Body() createService: CreateServiceDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) icon?: Express.Multer.File,
  ): Promise<ServiceEntity> {
    return this.manageServiceService.createService(createService, icon);
  }
  
  @ApiOperation({
    summary: 'get information a service',
  })
  @Get('detail/:serviceId')
  async getService(
    @Param() paramServiceId: ServiceIdDto, 
  ): Promise<any> {
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @Patch(':serviceId')
  async updateService(
    @Param() paramServiceId: ServiceIdDto, 
    @Body() updateService: UpdateServiceDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) icon?: Express.Multer.File,
  ): Promise<boolean> {
    return this.manageServiceService.updateService(paramServiceId.serviceId, updateService, icon);
  }
  
  @ApiOperation({
    summary: 'delete a service',
  })
  @Delete(':serviceId')
  async deleteService(
    @Param() paramServiceId: ServiceIdDto, 
  ): Promise<boolean> {
    return this.manageServiceService.deleteService(paramServiceId.serviceId);
  }
}