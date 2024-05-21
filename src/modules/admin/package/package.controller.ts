import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';

import { PackageEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { PackageIdDto } from 'src/shared/dtos';
import { ManagePackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { FilterPackageDto } from './dto/query-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@ApiTags('Admin | Package')
@ApiBearerAuth()
@Controller('admin/package')
@Roles([Role.Admin])
export class ManagePackageController {
  constructor( private readonly managePackageService: ManagePackageService ) {}
  
  @ApiOperation({
    summary: 'Create a package',
  })
  @Post('new')
  async createPackage(
    @Body() createPackage: CreatePackageDto, 
  ): Promise<PackageEntity> {
    return this.managePackageService.createPackage(createPackage);
  }
  
  @ApiOperation({
    summary: 'get information a package',
  })
  @Get('detail/:packageId')
  async getPackage(
    @Param() paramPackageId: PackageIdDto, 
  ): Promise<PackageEntity> {
    return this.managePackageService.getPackage(paramPackageId.packageId);
  }
  
  @ApiOperation({
    summary: 'get list package',
  })
  @Get('list')
  async getListPackage(
    @Query() filterPackage: FilterPackageDto, 
  ): Promise<PaginationResponse<PackageEntity>> {
    return await this.managePackageService.getListPackage(filterPackage);
  }
  
  @ApiOperation({
    summary: 'update information package',
  })
  @Patch(':packageId')
  async updateInformationPackage(
    @Param() paramPackageId: PackageIdDto, 
    @Body() updatePackage: UpdatePackageDto,
  ): Promise<boolean> {
    return this.managePackageService.updatePackage(paramPackageId.packageId, updatePackage);
  }
  
  @ApiOperation({
    summary: 'delete a package',
  })
  @Delete(':packageId')
  async deletePackage(
    @Param() paramPackageId: PackageIdDto, 
  ): Promise<boolean> {
    return this.managePackageService.deletePackage(paramPackageId.packageId);
  }
}