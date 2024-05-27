import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator";

export class ApplyPromotionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bookingId: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  promotionId: string;
}