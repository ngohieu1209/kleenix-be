import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
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
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
