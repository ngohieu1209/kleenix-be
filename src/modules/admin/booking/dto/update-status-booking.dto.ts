import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, NotContains } from 'class-validator';
import { BOOKING_STATUS } from 'src/shared/enums/booking.enum';

export class UpdateStatusBookingDto {
  @ApiPropertyOptional({
    enum: Object.keys(BOOKING_STATUS),
    example: BOOKING_STATUS.CANCELLED_BY_KLEENIX
  })
  @IsString()
  @IsOptional()
  @IsEnum(BOOKING_STATUS)
  status: BOOKING_STATUS
}