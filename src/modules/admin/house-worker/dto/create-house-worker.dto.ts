import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, NotContains } from 'class-validator';
import { GENDER } from 'src/shared/enums/gender.enum';

export class CreateHouseWorkerDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string => value?.trim())
  @MinLength(2)
  username: string;
  
  @ApiProperty({
    required: true,
    example: '123456',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;
  
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
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