import { createProfiguration } from '@golevelup/profiguration';
import { Logger } from '@nestjs/common';

interface Config {
  uploadMaxSize: number;
  uploadPath: string;
  port: number;
  frontendUrl: string;
  nodeEnv: 'development' | 'production' | 'test';
  typesenseEnabled: boolean;
  typesenseApiKey: string;
  typesenseHost: string;
  typesensePort: number;
  typesenseScheme: string;
  storageAccessKeyId: string;
  storageSecretAccessKey: string;
  storageEndpoint: string;
  storageRegion: string;
  accessTokenSecret: string;
  accessTokenExpiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
  cookieSignature: string;
  myefreiOauthClientId: string;
  myefreiOauthClientSecret: string;
  myefreiOauthAuthorizeUrl: string;
  myefreiOauthTokenUrl: string;
  myefreiOauthUserUrl: string;
  adminAccountUsername: string;
  adminAccountFirstName: string;
  adminAccountLastName: string;
  adminAccountPassword: string;
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
  frontendUrl: {
    default: 'http://localhost:3000',
    format: String,
    env: 'FRONTEND_URL',
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
  typesenseScheme: {
    default: 'http',
    format: ['http', 'https'],
    env: 'TYPESENSE_SCHEME',
  },
  storageAccessKeyId: {
    default: 'access-key-id',
    format: String,
    env: 'STORAGE_ACCESS_KEY_ID',
  },
  storageSecretAccessKey: {
    default: 'secret-access-key',
    format: String,
    env: 'STORAGE_SECRET_ACCESS_KEY',
  },
  storageEndpoint: {
    default: 'endpoint',
    format: String,
    env: 'STORAGE_ENDPOINT',
  },
  storageRegion: {
    default: 'PAR',
    format: String,
    env: 'STORAGE_REGION',
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
  myefreiOauthClientId: {
    default: 'client-id',
    format: String,
    env: 'MYEFREI_OAUTH_CLIENT_ID',
  },
  myefreiOauthClientSecret: {
    default: 'client-secret',
    format: String,
    env: 'MYEFREI_OAUTH_CLIENT_SECRET',
  },
  myefreiOauthAuthorizeUrl: {
    default: 'https://oauth2service.com/authorize',
    format: String,
    env: 'MYEFREI_OAUTH_AUTHORIZE_URL',
  },
  myefreiOauthTokenUrl: {
    default: 'https://oauth2service.com/token',
    format: String,
    env: 'MYEFREI_OAUTH_TOKEN_URL',
  },
  myefreiOauthUserUrl: {
    default: 'https://oauth2service.com/user',
    format: String,
    env: 'MYEFREI_OAUTH_USER_URL',
  },
  adminAccountUsername: {
    default: 'horizon-admin',
    format: String,
    env: 'ADMIN_ACCOUNT_USERNAME',
  },
  adminAccountFirstName: {
    default: 'Horizon',
    format: String,
    env: 'ADMIN_ACCOUNT_FIRST_NAME',
  },
  adminAccountLastName: {
    default: 'Admin',
    format: String,
    env: 'ADMIN_ACCOUNT_LAST_NAME',
  },
  adminAccountPassword: {
    default: 'root',
    format: String,
    env: 'ADMIN_ACCOUNT_PASSWORD',
  },
}, {
  strict: true,
  verbose: true,
  logger: (message: string) => {
    logger.log(message.replace(/^@golevelup\/profiguration: /g, ''));
  },
  configureEnv: () => ({ files: '.env' }),
});
