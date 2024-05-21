import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyPhoneNumberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string => value?.trim())
  code: string;
}