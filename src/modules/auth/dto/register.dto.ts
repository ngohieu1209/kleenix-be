import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength, NotContains } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    required: true,
    example: '84',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(3)
  @Matches(/^\d{2,3}$/, { message: 'phoneCode phải có từ 2 đến 3 chữ số' })
  phoneCode: string;
  
  @ApiProperty({
    required: true,
    example: '956895689',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6,12}$/, { message: 'phoneNumber phải là một chuỗi chữ số có độ dài từ 6 - 12 số' })
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
