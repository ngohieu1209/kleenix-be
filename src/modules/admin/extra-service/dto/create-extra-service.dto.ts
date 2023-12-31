import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, NotContains } from 'class-validator';

export class CreateExtraServiceDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string => value?.trim())
  @MinLength(2)
  name: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  duration: number;
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price: number;
}