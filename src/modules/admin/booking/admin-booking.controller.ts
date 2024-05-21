import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';
import { ManageBookingService } from './admin-booking.service';
import { FilterAdminBookingDto } from './dto/query-admin-booking.dto';
import { BookingIdDto } from 'src/shared/dtos';
import { UpdateStatusBookingDto } from './dto/update-status-booking.dto';

@ApiTags('Admin | Booking')
@ApiBearerAuth()
@Controller('admin/booking')
@Roles([Role.Admin])
export class ManageBookingController {
  constructor( private readonly manageBookingService: ManageBookingService ) {}
  
  @ApiOperation({
    summary: 'get list order of booking',
  })
  @Get('list')
  async getListBooking(
    @Query() filterAdminBooking: FilterAdminBookingDto
  ): Promise<any> {
    return this.manageBookingService.getListBooking(filterAdminBooking);
  }
  
  @ApiOperation({
    summary: 'get booking',
  })
  @Get('detail/:bookingId')
  async getBooking(
    @Param() paramBookingId: BookingIdDto, 
  ): Promise<any> {
    return this.manageBookingService.getBooking(paramBookingId.bookingId);
  }
  
  
  
  @ApiOperation({
    summary: 'update status of booking',
  })
  @Patch(':bookingId')
  async updateStatusBooking(
    @Param() paramBookingId: BookingIdDto, 
    @Body() updateStatusBooking: UpdateStatusBookingDto,
  ): Promise<boolean> {
    return this.manageBookingService.updateStatusBooking(paramBookingId.bookingId, updateStatusBooking);
  }
}