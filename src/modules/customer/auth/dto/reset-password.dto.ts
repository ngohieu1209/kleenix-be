import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    example: '123456',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string => value?.trim())
  code: string;
}