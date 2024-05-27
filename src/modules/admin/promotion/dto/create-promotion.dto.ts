import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, NotContains } from 'class-validator';

export class CreatePromotionDto {
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
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  point: number;
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  discount: number;
  
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;
  
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endTime: Date;
  
  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image: Express.Multer.File;
}