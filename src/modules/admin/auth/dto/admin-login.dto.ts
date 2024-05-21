import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AdminLoginRequestDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AdminLoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
