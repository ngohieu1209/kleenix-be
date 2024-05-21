import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class QueryScheduleDto {
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
}
