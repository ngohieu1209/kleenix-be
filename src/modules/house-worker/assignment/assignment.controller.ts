import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterAdminBookingDto } from 'src/modules/admin/booking/dto/query-admin-booking.dto';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { BookingIdDto, JwtPayload } from 'src/shared/dtos';
import { AssignmentService } from './assignment.service';

@ApiTags('House Worker | Assignment')
@ApiBearerAuth()
@Controller('house-worker/assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) { }
  // TODO: danh sách các list booking đang pending - (DONE - chưa ghép)
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
  
  // TODO: nhận đơn booking - (DONE - chưa ghép)
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
}