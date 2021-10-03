import { createProfiguration } from '@golevelup/profiguration';
import { Logger } from '@nestjs/common';

interface Config {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  mongoUri: string;
  frontEndUrl: string;
  accessTokenSecret: string;
  accessTokenExpiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
}

const logger = new Logger('Configuration');

export const config = createProfiguration<Config>({
  port: {
    default: 5000,
    format: Number,
    env: 'PORT',
  },
  nodeEnv: {
    default: 'development',
    format: ['development', 'production', 'test'],
    env: 'NODE_ENV',
  },
  mongoUri: {
    default: 'mongodb://localhost/horizon-db',
    format: String,
    env: 'MONGO_URI',
  },
  frontEndUrl: {
    default: 'http://localhost:8080',
    format: String,
    env: 'FRONTEND_URL',
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
}, {
  strict: true,
  verbose: true,
  logger: (message: string) => {
    logger.log(message.replace(/^@golevelup\/profiguration: /g, ''));
  },
  configureEnv: () => ({ files: '.env' }),
});
