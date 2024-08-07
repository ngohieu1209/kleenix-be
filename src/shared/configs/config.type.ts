export type AppConfig = {
  env: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
};

export type AuthConfig = {
  publicKey?: string;
  privateKey?: string;
  accessExpires?: string;
  refreshExpires?: string;
};

export type DatabaseConfig = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections?: number;
};

export type RedisConfig = {
  host?: string;
  port?: number;
};

export type FileConfig = {
  driver: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsDefaultS3Url?: string;
  awsS3Region?: string;
  maxFileSize: number;
};

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  file: FileConfig;
};

export type SmsConfig = {
  accountSID?: string;
  authToken?: string;
  serviceSID?: string;
  senderPhoneNumber?: string;
};

export type StripeConfig = {
  stripeSecretKey?: string;
};