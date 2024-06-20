import { IsNotEmpty, IsString } from 'class-validator';

export class MarkNotificationDto {
  @IsString()
  @IsNotEmpty()
  notificationId: string;
}
