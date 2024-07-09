import { Body, Controller, Get, Param, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterAdminBookingDto } from 'src/modules/admin/booking/dto/query-admin-booking.dto';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { AssignmentIdDto, BookingIdDto, JwtPayload } from 'src/shared/dtos';
import { ImageFileValidator } from 'src/shared/validators/image-file.validator';
import { AssignmentService } from './assignment.service';

@ApiTags('House Worker | Assignment')
@ApiBearerAuth()
@Controller('house-worker/assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) { }
  @ApiOperation({
    summary: 'Danh sách tất cả các list booking đang pending',
  })
  @Get('list-booking')
  async getListBookingPending(
    @JwtDecodedData() data: JwtPayload,
    @Query() filterAdminBooking: FilterAdminBookingDto
  ): Promise<any> {
    return this.assignmentService.getListBookingPending(data.userId, filterAdminBooking);
  }
  
  @ApiOperation({
    summary: 'Chi tiết assignment',
  })
  @Get('detail/:assignmentId')
  async getDetailAssignment(
    @JwtDecodedData() data: JwtPayload,
    @Param() paramAssignment: AssignmentIdDto,
  ): Promise<any> {
    return this.assignmentService.getDetailAssignment(data.userId, paramAssignment.assignmentId);
  }
  
  @ApiOperation({
    summary: 'Nhận đơn booking',
  })
  @Post('accept-booking')
  async acceptBooking(
    @JwtDecodedData() data: JwtPayload,
    @Body() bodyBooking: BookingIdDto,
  ): Promise<any> {
    return this.assignmentService.acceptBooking(data.userId, bodyBooking.bookingId);
  }
  
  @ApiOperation({
    summary: 'Thay đổi trạng thái booking',
  })
  @Post('update-status-booking')
  async updateStatusBooking(
    @JwtDecodedData() data: JwtPayload,
    @Body() bodyBooking: BookingIdDto,
  ): Promise<any> {
    return this.assignmentService.updateStatusBooking(data.userId, bodyBooking.bookingId);
  }
  
  @ApiOperation({
    summary: 'Completed booking',
  })
  @Post('completed-booking')
  async completedBooking(
    @JwtDecodedData() data: JwtPayload,
    @Body() bodyBooking: BookingIdDto,
  ): Promise<any> {
    return this.assignmentService.completedBooking(data.userId, bodyBooking.bookingId);
  }
  
  @ApiOperation({
    summary: 'Chụp bằng chứng',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('evidence'))
  @Post('evidence')
  async evidenceCompleted(
    @JwtDecodedData() data: JwtPayload,
    @Body() bodyBooking: BookingIdDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) evidence?: Express.Multer.File,
  ): Promise<any> {
    return this.assignmentService.updateEvidence(data.userId, bodyBooking.bookingId, evidence);
  }
}