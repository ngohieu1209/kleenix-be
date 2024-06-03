import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';

import { HouseWorkerEntity } from 'src/models/entities';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { ExtraServiceIdDto, HouseWorkerIdDto } from 'src/shared/dtos';
import { ManageHouseWorkerService } from './house-worker.service';
import { CreateHouseWorkerDto } from './dto/create-house-worker.dto';
import { FilterHouseWorkerDto } from './dto/query-house-worker.dto';
import { UpdateHouseWorkerDto } from './dto/update-house-worker.dto';
import { FilterAdminBookingDto } from '../booking/dto/query-admin-booking.dto';

@ApiTags('Admin | House Worker')
@ApiBearerAuth()
@Controller('admin/house-worker')
@Roles([Role.Admin, Role.MANAGER])
export class ManageHouseWorkerController {
  constructor( private readonly manageHouseWorkerService: ManageHouseWorkerService ) {}
  
  @ApiOperation({
    summary: 'Create a house worker',
  })
  @Post('new')
  async createHouseWorker(
    @Body() createHouseWorker: CreateHouseWorkerDto, 
  ): Promise<HouseWorkerEntity> {
    return this.manageHouseWorkerService.createHouseWorker(createHouseWorker);
  }
  
  @ApiOperation({
    summary: 'get information a house worker',
  })
  @Get('detail/:houseWorkerId')
  async getHouseWorker(
    @Param() paramHouseWorkerId: HouseWorkerIdDto, 
  ): Promise<HouseWorkerEntity> {
    return this.manageHouseWorkerService.getHouseWorker(paramHouseWorkerId.houseWorkerId);
  }
  
  @ApiOperation({
    summary: 'get list assignment house worker',
  })
  @Get('assignment/:houseWorkerId')
  async getListAssignment(
    @Param() paramHouseWorkerId: HouseWorkerIdDto, 
    @Query() filterAdminBooking: FilterAdminBookingDto
  ): Promise<any> {
    return this.manageHouseWorkerService.getListAssignmentHouseWorker(paramHouseWorkerId.houseWorkerId, filterAdminBooking);
  }
  
  @ApiOperation({
    summary: 'get list all house worker',
  })
  @Get('list')
  async getListHouseWorker(
    @Query() filterHouseWorker: FilterHouseWorkerDto, 
  ): Promise<PaginationResponse<HouseWorkerEntity>> {
    return await this.manageHouseWorkerService.getListHouseWorker(filterHouseWorker);
  }
  
  @ApiOperation({
    summary: 'update information house worker',
  })
  @Patch(':houseWorkerId')
  async updateInformationHouseWorker(
    @Param() paramHouseWorkerId: HouseWorkerIdDto, 
    @Body() updateHouseWorker: UpdateHouseWorkerDto,
  ): Promise<boolean> {
    return this.manageHouseWorkerService.updateHouseWorker(paramHouseWorkerId.houseWorkerId, updateHouseWorker);
  }
  
  @ApiOperation({
    summary: 'delete a house worker',
  })
  @Delete(':houseWorkerId')
  async deleteHouseWorker(
    @Param() paramHouseWorkerId: HouseWorkerIdDto, 
  ): Promise<boolean> {
    return this.manageHouseWorkerService.deleteHouseWorker(paramHouseWorkerId.houseWorkerId);
  }
}