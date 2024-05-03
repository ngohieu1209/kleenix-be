import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, NotContains } from 'class-validator';
import { GENDER } from 'src/shared/enums/gender.enum';

export class UpdateHouseWorkerDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }): string => value?.trim())
  @MinLength(2)
  name: string;
  
  @ApiPropertyOptional({
    enum: Object.keys(GENDER),
    example: GENDER.MALE
  })
  @IsString()
  @IsOptional()
  @IsEnum(GENDER)
  gender: GENDER
  
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  age: number;
}