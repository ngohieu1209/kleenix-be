import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class PostFeedbackDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  feedback: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bookingId: string;
}