import { registerAs } from '@nestjs/config';
import { SmsConfig } from './config.type';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from 'src/shared/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsString()
  TWILIO_SENDER_PHONE_NUMBER: string;

  @IsString()
  @IsOptional()
  TWILIO_VERIFICATION_SERVICE_SID: string;
}

export default registerAs<SmsConfig>('twilio', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accountSID: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    serviceSID: process.env.TWILIO_VERIFICATION_SERVICE_SID,
    senderPhoneNumber: process.env.TWILIO_SENDER_PHONE_NUMBER
  };
});