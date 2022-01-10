import { createProfiguration } from '@golevelup/profiguration';
import { Logger } from '@nestjs/common';

interface Config {
  uploadMaxSize: number;
  uploadPath: string;
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  typesenseEnabled: boolean;
  typesenseApiKey: string;
  typesenseHost: string;
  typesensePort: number;
  accessTokenSecret: string;
  accessTokenExpiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
  cookieSignature: string;
}

const logger = new Logger('Configuration');

export const config = createProfiguration<Config>({
  uploadMaxSize: {
    default: 10_485_760,
    format: Number,
    env: 'UPLOAD_MAX_SIZE',
  },
  uploadPath: {
    default: 'uploads',
    format: String,
    env: 'UPLOAD_PATH',
  },
  port: {
    default: 8081,
    format: Number,
    env: 'PORT',
  },
  nodeEnv: {
    default: 'development',
    format: ['development', 'production', 'test'],
    env: 'NODE_ENV',
  },
  typesenseEnabled: {
    default: true,
    format: Boolean,
    env: 'TYPESENSE_ENABLED',
  },
  typesenseApiKey: {
    default: 'api-key',
    format: String,
    env: 'TYPESENSE_API_KEY',
  },
  typesenseHost: {
    default: 'localhost',
    format: String,
    env: 'TYPESENSE_HOST',
  },
  typesensePort: {
    default: 8108,
    format: Number,
    env: 'TYPESENSE_PORT',
  },
  accessTokenSecret: {
    default: 'secret',
    format: String,
    env: 'ACCESS_TOKEN_SECRET',
  },
  accessTokenExpiration: {
    default: '3600s',
    format: String,
    env: 'ACCESS_TOKEN_EXPIRATION',
  },
  refreshTokenSecret: {
    default: 'secret',
    format: String,
    env: 'REFRESH_TOKEN_SECRET',
  },
  refreshTokenExpiration: {
    default: '1y',
    format: String,
    env: 'REFRESH_TOKEN_EXPIRATION',
  },
  cookieSignature: {
    default: 'secret',
    format: String,
    env: 'COOKIE_SIGNATURE_SECRET',
  },
}, {
  strict: true,
  verbose: true,
  logger: (message: string) => {
    logger.log(message.replace(/^@golevelup\/profiguration: /g, ''));
  },
  configureEnv: () => ({ files: '.env' }),
});
