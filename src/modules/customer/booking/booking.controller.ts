import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { BookingIdDto, JwtPayload } from 'src/shared/dtos';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';

@ApiTags('Customer | Booking')
@ApiBearerAuth()
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }
  
  @ApiOperation({
    summary: 'Booking',
  })
  @Post('new')
  async booking(
    @JwtDecodedData() data: JwtPayload,
    @Body() createBooking: CreateBookingDto
  ): Promise<any> {
    return this.bookingService.createBooking(data.userId, createBooking);
  }
  
  @ApiOperation({
    summary: 'Cancel booking',
  })
  @Post('cancel')
  async cancelBooking(
    @JwtDecodedData() data: JwtPayload,
    @Body() cancelBooking: BookingIdDto
  ): Promise<any> {
    return this.bookingService.cancelBooking(data.userId, cancelBooking.bookingId);
  }
  
  @ApiOperation({
    summary: 'list booking',
  })
  @Get('list')
  async getListBooking(
    @JwtDecodedData() data: JwtPayload,
    @Query() queryBooking: QueryBookingDto
  ): Promise<any> {
    return this.bookingService.getListBooking(data.userId, queryBooking);
  }
  
  @ApiOperation({
    summary: 'detail booking',
  })
  @Get('detail/:bookingId')
  async getBooking(
    @JwtDecodedData() data: JwtPayload,
    @Param() paramBooking: BookingIdDto
  ): Promise<any> {
    return this.bookingService.getBooking(data.userId, paramBooking.bookingId);
  }
}