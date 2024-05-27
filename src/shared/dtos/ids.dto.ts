import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ExtraServiceIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  extraServiceId: string;
}

export class ServiceIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceId: string;
}

export class HouseWorkerIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  houseWorkerId: string;
}

export class CustomerIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerId: string;
}

export class PackageIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  packageId: string;
}

export class AddressIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressId: string;
}

export class BookingIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bookingId: string;
}

export class PromotionIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  promotionId: string;
}

export class FeedbackIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  feedbackId: string;
}