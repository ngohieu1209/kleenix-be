import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { BOOKING_STATUS } from "src/shared/enums/booking.enum";

export class QueryBookingDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }): string => value?.trim())
  startDate: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }): string => value?.trim())
  endDate: string;
  
  @ApiPropertyOptional({ enum: BOOKING_STATUS, isArray: true })
  @IsArray()
  @IsEnum(BOOKING_STATUS, { each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',').map(item => item.trim()) : value)
  @IsOptional()
  status: BOOKING_STATUS[];
}
