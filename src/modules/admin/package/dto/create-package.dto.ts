import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePackageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
  
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  duration: number;
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;
  
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  // @Transform(({ value }): boolean => value === 'true')
  activate: boolean;
  
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  serviceId: string;
}