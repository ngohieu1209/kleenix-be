import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator";

export class PaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(200000, { message: 'Số tiền nạp tối thiểu là 200.000 VNĐ' })
  amount: number;
}