import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { ManageServiceService } from './admin-service.service';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { CreateServiceDto } from './dto/create-service.dto';

@ApiTags('Admin | Service')
@ApiBearerAuth()
@Controller('admin/service')
@Roles([Role.Admin])
export class ManageServiceController {
  constructor( private readonly manageCourseService: ManageServiceService ) {}
  
  @ApiOperation({
    summary: 'Create a service',
  })
  @Post('new')
  async createCourse(
    @Body() createService: CreateServiceDto, 
  ): Promise<any> {
    return this.manageCourseService.createService(createService);
  }
  
  // @ApiOperation({
  //   summary: 'Thông tin của 1 khóa học',
  // })
  // @Get('details/:courseId')
  // async getCourse(
  //   @Param() paramCourseId: ParamCourseIdDto, 
  // ): Promise<CourseEntity> {
  //   return this.manageCourseService.getCourse(paramCourseId.courseId);
  // }
  
  // @ApiOperation({
  //   summary: 'Lấy danh sách khóa học',
  // })
  // @Get('list')
  // async getListCourses(
  //   @Query() filterCourse: FilterCourseDto, 
  // ): Promise<PaginationResponse<any>> {
  //   return await this.manageCourseService.getListCourses(filterCourse);
  // }
  
  // @ApiOperation({
  //   summary: 'Cập nhật thông tin một khóa học',
  // })
  // @Patch(':courseId')
  // async updateInformationCourse(
  //   @Param() paramCourseId: ParamCourseIdDto, 
  //   @Body() updateInformationCourse: UpdateInformationCourseDto,
  // ): Promise<any> {
  //   return this.manageCourseService.updateInformationCourse(paramCourseId.courseId, updateInformationCourse);
  // }
  
  // @ApiOperation({
  //   summary: 'Xóa một khóa học',
  // })
  // @Delete(':courseId')
  // async deleteCourse(
  //   @Param() paramCourseId: ParamCourseIdDto, 
  // ): Promise<boolean> {
  //   return this.manageCourseService.deleteCourse(paramCourseId.courseId);
  // }
}