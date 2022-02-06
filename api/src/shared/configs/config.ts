import { createProfiguration } from '@golevelup/profiguration';
import { Logger } from '@nestjs/common';

interface Config {
  uploadMaxSize: number;
  uploadPath: string;
  port: number;
  devFrontendPort: string;
  baseUrl: string;
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
  distantStorageEnabled: boolean;
  accessTokenSecret: string;
  accessTokenExpiration: string;
  accessTokenExpirationSeconds: number;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
  refreshTokenExpirationSeconds: number;
  cookieSignature: string;
  myefreiOidcClientId: string;
  myefreiOidcClientSecret: string;
  myefreiOidcDiscoveryUrl: string;
  myefreiOidcScopes: string;
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
  devFrontendPort: {
    default: 'http://localhost:3000',
    format: String,
    env: 'FRONTEND_URL',
  },
  baseUrl: {
    default: 'horizon-efrei.fr',
    format: String,
    env: 'BASE_URL',
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
  distantStorageEnabled: {
    default: false,
    format: Boolean,
    env: 'DISTANT_STORAGE_ENABLED',
  },
  accessTokenSecret: {
    default: 'secret',
    format: String,
    env: 'ACCESS_TOKEN_SECRET',
  },
  accessTokenExpiration: {
    default: '8h',
    format: String,
    env: 'ACCESS_TOKEN_EXPIRATION',
  },
  accessTokenExpirationSeconds: {
    default: 28_800,
    format: Number,
    env: 'ACCESS_TOKEN_EXPIRATION_SECONDS',
  },
  refreshTokenSecret: {
    default: 'secret',
    format: String,
    env: 'REFRESH_TOKEN_SECRET',
  },
  refreshTokenExpiration: {
    default: '7d',
    format: String,
    env: 'REFRESH_TOKEN_EXPIRATION',
  },
  refreshTokenExpirationSeconds: {
    default: 604_800,
    format: Number,
    env: 'REFRESH_TOKEN_EXPIRATION_SECONDS',
  },
  cookieSignature: {
    default: 'secret',
    format: String,
    env: 'COOKIE_SIGNATURE_SECRET',
  },
  myefreiOidcClientId: {
    default: 'client-id',
    format: String,
    env: 'MYEFREI_OIDC_CLIENT_ID',
  },
  myefreiOidcClientSecret: {
    default: 'client-secret',
    format: String,
    env: 'MYEFREI_OIDC_CLIENT_SECRET',
  },
  myefreiOidcDiscoveryUrl: {
    default: 'https://oauth2service.com/.well-known/openid-configuration',
    format: String,
    env: 'MYEFREI_OIDC_DISCOVERY_URL',
  },
  myefreiOidcScopes: {
    default: 'openid profile',
    format: String,
    env: 'MYEFREI_OIDC_SCOPES',
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

export const computedConfig = {
  apiUrl: config.get('nodeEnv') === 'development'
    ? `http://localhost:${config.get('port')}`
    : `https://api.${config.get('baseUrl')}`,
  frontendUrl: config.get('nodeEnv') === 'development'
    ? 'http://localhost:3000'
    : `https://${config.get('baseUrl')}`,
};
