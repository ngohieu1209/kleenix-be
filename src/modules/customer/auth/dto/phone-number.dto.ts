import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class PhoneNumberDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Matches(/^\d{9,10}$/, { message: 'phoneNumber phải là một chuỗi chữ số có độ dài từ 9 hoặc 10 số' })
  phoneNumber: string;
}