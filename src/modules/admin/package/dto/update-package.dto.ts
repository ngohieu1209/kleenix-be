import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePackageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
  
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  duration: number;
  
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }): boolean => value === 'true')
  activate: boolean;
  
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price: number;
}