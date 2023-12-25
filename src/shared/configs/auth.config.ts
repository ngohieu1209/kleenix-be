import { registerAs } from '@nestjs/config';
import { AuthConfig } from './config.type';
import { IsString } from 'class-validator';
import validateConfig from 'src/shared/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  JWT_PUBLIC_KEY_ENCODE: string;

  @IsString()
  JWT_PRIVATE_KEY_ENCODE: string;
  
  @IsString()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    publicKey: Buffer.from(process.env.JWT_PUBLIC_KEY_ENCODE, 'base64').toString('ascii'),
    privateKey: Buffer.from(process.env.JWT_PRIVATE_KEY_ENCODE, 'base64').toString('ascii'),
    accessExpires: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refreshExpires: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  };
});
