import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength, NotContains } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    required: true,
    example: '84',
  })
  @MinLength(2)
  @MaxLength(3)
  @IsString()
  @IsNotEmpty()
  phoneCode: string;
  
  @ApiProperty({
    required: true,
    example: '956895689',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

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
  @NotContains(" ")
  @Transform(({ value }): string => value?.trim())
  @MinLength(2)
  @MaxLength(25)
  name: string;
}

export class RegisterResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  phoneCode: string
  
  @ApiProperty()
  phoneNumber: string
}
