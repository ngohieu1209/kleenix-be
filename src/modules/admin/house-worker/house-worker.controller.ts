import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidator } from 'src/shared/validators/image-file.validator';
import { ResetPasswordWorkerDto } from './dto/reset-password-worker.dto';

@ApiTags('Admin | House Worker')
@ApiBearerAuth()
@Controller('admin/house-worker')
@Roles([Role.Admin, Role.MANAGER])
export class ManageHouseWorkerController {
  constructor( private readonly manageHouseWorkerService: ManageHouseWorkerService ) {}
  
  @ApiOperation({
    summary: 'Create a house worker',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('new')
  async createHouseWorker(
    @Body() createHouseWorker: CreateHouseWorkerDto, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) avatar?: Express.Multer.File,
  ): Promise<HouseWorkerEntity> {
    return this.manageHouseWorkerService.createHouseWorker(createHouseWorker, avatar);
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch(':houseWorkerId')
  async updateInformationHouseWorker(
    @Param() paramHouseWorkerId: HouseWorkerIdDto, 
    @Body() updateHouseWorker: UpdateHouseWorkerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) avatar?: Express.Multer.File,
  ): Promise<any> {
    return this.manageHouseWorkerService.updateHouseWorker(paramHouseWorkerId.houseWorkerId, updateHouseWorker, avatar);
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
  
  @ApiOperation({
    summary: 'Reset password',
  })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPasswordUser(
    @Body() resetPasswordWorker: ResetPasswordWorkerDto,
  ): Promise<any> {
    return this.manageHouseWorkerService.resetPasswordHouseWorker(resetPasswordWorker);
  }
}