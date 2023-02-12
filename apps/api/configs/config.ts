import { S3Buckets, TokenType } from '@okampus/shared/enums';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { ApiConfig } from '@okampus/shared/types';

const _dirname = typeof __dirname === 'undefined' ? dirname(fileURLToPath(import.meta.url)) : __dirname;
export const appPath = `${_dirname}/../../../apps/api`;

dotenv.config({ path: `${appPath}/.env` });

// Helpers
const parseEnvInt = (value: string | undefined, defaultValue: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : defaultValue;
};
const parseEnvBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  const parsed = value && ['true', 'false'].includes(value);
  return parsed ? value === 'true' : defaultValue;
};

// Validation
if (process.env.NODE_ENV && !['production', 'development', 'test'].includes(process.env.NODE_ENV))
  throw new TypeError('NODE_ENV is not set to a valid value');

const getEnabled = (enabledValue?: string, fallbackVariable?: string): boolean => {
  const enabled = parseEnvBoolean(enabledValue, true);
  if (enabled && !fallbackVariable) return false;
  return enabled;
};

// Shortcuts
const nodeEnv = process.env.NODE_ENV ?? 'development';
const baseDomain = process.env.BASE_DOMAIN ?? 'localhost';
const port = parseEnvInt(process.env.PORT, 8081);
const frontendOriginUrl = process.env.FRONTEND_ORIGIN_URL ?? 'localhost';

// Config object
export const config: ApiConfig = {
  nodeEnv,
  env: {
    isDev: () => nodeEnv === 'development',
    isProd: () => nodeEnv === 'production',
    isTest: () => nodeEnv === 'test',
  },
  release: process.env.RELEASE ?? 'alpha',
  network: {
    port,
    frontendOriginUrl,
    baseDomain,
    apiUrl: nodeEnv === 'development' ? `http://localhost:${port}` : `https://api.${baseDomain}`,
    frontendUrl: nodeEnv === 'development' ? 'http://localhost:5173' : `https://${frontendOriginUrl}`,
  },
  upload: {
    localPath: `${appPath}/${process.env.UPLOAD_PATH ?? 'uploads'}`,
    localPrefix: process.env.UPLOAD_PATH ?? 'uploads',
  },
  meilisearch: {
    enabled: getEnabled(process.env.MEILISEARCH_ENABLED, process.env.MEILISEARCH_HOST),
    host: process.env.MEILISEARCH_HOST ?? 'localhost:7700',
    apiKey: process.env.MEILISEARCH_API_KEY ?? 'api-key',
  },
  database: {
    seed: parseEnvBoolean(process.env.MIKRO_ORM_SEED, false),
    name: process.env.DB_NAME ?? 'db-name',
    user: process.env.DB_USER ?? 'user',
    password: process.env.DB_PASSWORD ?? 'secret-db-user',
  },
  s3: {
    enabled: parseEnvBoolean(process.env.S3_ENABLED, false),
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? 'access-key-id',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? 'secret-access-key',
    endpoint: process.env.S3_ENDPOINT ?? 'endpoint',
    region: process.env.S3_REGION ?? 'region',
    buckets: {
      [S3Buckets.Attachments]: process.env.S3_BUCKET_NAME_ATTACHMENTS ?? 'bucket-attachments',
      [S3Buckets.OrgDocuments]: process.env.S3_BUCKET_NAME_ORG_DOCUMENTS ?? 'bucket-org-documents',
      [S3Buckets.OrgImages]: process.env.S3_BUCKET_NAME_ORG_IMAGES ?? 'bucket-org-images',
      [S3Buckets.OrgVideos]: process.env.S3_BUCKET_NAME_ORG_VIDEOS ?? 'bucket-org-videos',
      [S3Buckets.UserImages]: process.env.S3_BUCKET_NAME_USER_IMAGES ?? 'bucket-user-images',
    },
  },
  redis: {
    enabled: getEnabled(process.env.REDIS_ENABLED, process.env.REDIS_HOST),
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseEnvInt(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD ?? '',
  },
  sentry: {
    enabled: parseEnvBoolean(process.env.SENTRY_ENABLED, false),
    dsn: process.env.SENTRY_DSN ?? 'https://sentry.io',
  },
  novu: {
    enabled: parseEnvBoolean(process.env.NOVU_ENABLED, false),
    apiKey: process.env.NOVU_API_KEY ?? 'api-key',
    appId: process.env.NOVU_APP_ID ?? 'app-id',
  },
  tokens: {
    issuer: process.env.TOKEN_ISSUER_NAME ?? 'Okampus',
    secrets: {
      [TokenType.Access]: process.env.ACCESS_TOKEN_SECRET ?? 'acess_token_secret',
      [TokenType.Refresh]: process.env.REFRESH_TOKEN_SECRET ?? 'refresh_token_secret',
      [TokenType.WebSocket]: process.env.WS_TOKEN_SECRET ?? 'websocket_token_secret',
      [TokenType.Bot]: process.env.BOT_TOKEN_SECRET ?? 'bot_token_secret',
    },
    expirations: {
      [TokenType.Access]: parseEnvInt(process.env.ACCESS_TOKEN_EXPIRATION_SECONDS, 28_800),
      [TokenType.Refresh]: parseEnvInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS, 604_800),
      [TokenType.WebSocket]: parseEnvInt(process.env.WS_TOKEN_EXPIRATION_SECONDS, 30),
    },
  },
  cookies: {
    names: {
      [TokenType.MeiliSearch]: process.env.MEILISEARCH_TOKEN_COOKIE_NAME ?? 'meilisearch_key',
      [TokenType.Access]: process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'access_token',
      [TokenType.Refresh]: process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'refresh_token',
      [TokenType.WebSocket]: process.env.WS_TOKEN_COOKIE_NAME ?? 'ws_token',
      AccessExpiration: process.env.ACCESS_TOKEN_EXPIRATION_COOKIE_NAME ?? 'access_exp',
      RefreshExpiration: process.env.REFRESH_TOKEN_EXPIRATION_COOKIE_NAME ?? 'refresh_exp',
    },
    signature: process.env.COOKIE_SIGNATURE_SECRET ?? 'cookie_secret',
    // This is only the default value, the real value is set right after the config is initialized.
    options: {
      signed: true,
      secure: nodeEnv === 'production',
      path: '/',
      httpOnly: true,
      // eslint-disable-next-line no-undefined
      domain: nodeEnv === 'production' ? `.${baseDomain}` : undefined,
    },
  },
  session: {
    secret: process.env.SESSION_SECRET ?? 'session_secret',
  },
  cryptoSecret: process.env.CRYPTO_PEPPER_SECRET ?? 'CRYPTO_PEPPER_SECRET',
  adminAccountPassword: process.env.ADMIN_ACCOUNT_PASSWORD ?? 'root',
  baseTenant: {
    name: process.env.BASE_TENANT_NAME ?? 'Demo Tenant',
    oidc: {
      enabled: parseEnvBoolean(process.env.BASE_TENANT_OIDC_ENABLED, false),
      name: process.env.BASE_TENANT_OIDC_NAME ?? 'demo-tenant',
      clientId: process.env.BASE_TENANT_OIDC_CLIENT_ID ?? 'your_oidc_client_id',
      clientSecret: process.env.BASE_TENANT_OIDC_CLIENT_SECRET ?? 'your_oidc_client_secret',
      discoveryUrl:
        process.env.BASE_TENANT_OIDC_DISCOVERY_URL ?? 'https://oauth2service.com/.well-known/openid-configuration',
      scopes: process.env.BASE_TENANT_OIDC_SCOPES ?? 'openid profile',
      callbackUri: process.env.BASE_TENANT_OIDC_CALLBACK_URI ?? 'https://api.okampus.fr/auth/tenant/callback',
    },
  },
  settings: {
    metricsCron: process.env.METRICS_CRON ?? '*/15 * * * *',
  },
} as const;
