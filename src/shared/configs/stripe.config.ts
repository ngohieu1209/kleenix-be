import { registerAs } from '@nestjs/config';
import { StripeConfig } from './config.type';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from 'src/shared/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  STRIPE_SECRET_KEY: string;
}

export default registerAs<StripeConfig>('stripe', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  };
});