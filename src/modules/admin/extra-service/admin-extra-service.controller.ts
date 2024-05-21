import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';

import { ExtraServiceEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { ManageExtraServiceService } from './admin-extra-service.service';
import { CreateExtraServiceDto } from './dto/create-extra-service.dto';
import { ExtraServiceIdDto } from 'src/shared/dtos';
import { FilterExtraServiceDto } from './dto/query-extra-service.dto';
import { UpdateExtraServiceDto } from './dto/update-extra-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidator } from 'src/shared/validators/image-file.validator';

@ApiTags('Admin | Extra Service')
@ApiBearerAuth()
@Controller('admin/extra-service')
@Roles([Role.Admin])
export class ManageExtraServiceController {
  constructor( private readonly manageExtraServiceService: ManageExtraServiceService ) {}
  
  @ApiOperation({
    summary: 'Create a extra service',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @Post('new')
  async createExtraService(
    @Body() createExtraService: CreateExtraServiceDto, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) icon?: Express.Multer.File,
  ): Promise<ExtraServiceEntity> {
    return this.manageExtraServiceService.createExtraService(createExtraService, icon);
  }
  
  @ApiOperation({
    summary: 'get information a extra service',
  })
  @Get('detail/:extraServiceId')
  async getExtraService(
    @Param() paramExtraServiceId: ExtraServiceIdDto, 
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @Patch(':extraServiceId')
  async updateInformationExtraService(
    @Param() paramExtraServiceId: ExtraServiceIdDto, 
    @Body() updateExtraService: UpdateExtraServiceDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) icon?: Express.Multer.File,
  ): Promise<boolean> {
    return this.manageExtraServiceService.updateExtraService(paramExtraServiceId.extraServiceId, updateExtraService, icon);
  }
  
  @ApiOperation({
    summary: 'delete a extra service',
  })
  @Delete(':extraServiceId')
  async deleteExtraService(
    @Param() paramExtraServiceId: ExtraServiceIdDto, 
  ): Promise<boolean> {
    return this.manageExtraServiceService.deleteExtraService(paramExtraServiceId.extraServiceId);
  }
}