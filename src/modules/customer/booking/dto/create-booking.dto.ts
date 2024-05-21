import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { BOOKING_STATUS } from "src/shared/enums/booking.enum";

class ObjectPackage {
  @ApiProperty()
  @IsString()
  packageId: string;
  
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

export class CreateBookingDto {
  @ApiProperty({ type: [ObjectPackage]})
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ObjectPackage)
  listPackage: ObjectPackage[];
  
  @ApiProperty({ type: [String]})
  @IsArray()
  @IsNotEmpty()
  extraServiceIds: string[];
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  duration: number;
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  totalPrice: number;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note: string;
  
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateTime: Date;
}
