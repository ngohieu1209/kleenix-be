import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Matches(/^\d{1,3}$/, { message: 'phoneCode phải có từ 1 đến 3 chữ số' })
  phoneCode: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Matches(/^\d{6,12}$/, { message: 'phoneNumber phải là một chuỗi chữ số có độ dài từ 6 - 12 số' })
  phoneNumber: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
}