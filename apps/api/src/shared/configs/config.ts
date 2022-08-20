import 'dotenv/config';
import type { CookieOptions } from 'express';
import { FileKind } from '../lib/types/enums/file-kind.enum';

// Helpers
const parseEnvInt = (value: string | undefined, defaultValue: number): number => {
  const parsed = Number(value);
  return Number.isInteger(value) ? defaultValue : parsed;
};
const parseEnvBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  const parsed = value && ['true', 'false'].includes(value);
  return parsed ? value === 'true' : defaultValue;
};

// Validation
if (process.env.NODE_ENV && !['production', 'development', 'test'].includes(process.env.NODE_ENV))
  throw new TypeError('NODE_ENV is not set to a valid value');

// Shortcuts
const nodeEnv = process.env.NODE_ENV ?? 'development';
const baseDomain = process.env.BASE_DOMAIN ?? 'localhost';
const port = parseEnvInt(process.env.PORT, 8081);
const frontendOriginUrl = process.env.FRONTEND_ORIGIN_URL ?? 'localhost';

// The config object!
export const config = {
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
    apiUrl: nodeEnv === 'development'
      ? `http://localhost:${port}`
      : `https://api.${baseDomain}`,
    frontendUrl: nodeEnv === 'development'
      ? 'http://localhost:5173'
      : `https://${frontendOriginUrl}`,
  },
  baseTenant: {
    id: process.env.BASE_TENANT_ID ?? 'demo-tenant',
    oidc: {
      enabled: parseEnvBoolean(process.env.BASE_TENANT_OIDC_ENABLED, false),
      clientId: process.env.BASE_TENANT_OIDC_CLIENT_ID ?? 'your_oidc_client_id',
      clientSecret: process.env.BASE_TENANT_OIDC_CLIENT_SECRET ?? 'your_oidc_client_secret',
      discoveryUrl: process.env.BASE_TENANT_OIDC_DISCOVERY_URL ?? 'https://oauth2service.com/.well-known/openid-configuration',
      scopes: process.env.BASE_TENANT_OIDC_SCOPES ?? 'openid profile',
      callbackUri: process.env.BASE_TENANT_OIDC_CALLBACK_URI ?? 'https://api.okampus.fr/auth/tenant/callback',
    },
  },
  upload: {
    maxSize: parseEnvInt(process.env.UPLOAD_MAX_SIZE, 10_485_760),
    path: process.env.UPLOAD_PATH ?? 'uploads',
  },
  meilisearch: {
    enabled: parseEnvBoolean(process.env.MEILISEARCH_ENABLED, false),
    host: process.env.MEILISEARCH_HOST ?? 'localhost:7700',
    apiKey: process.env.MEILISEARCH_API_KEY ?? 'api-key',
  },
  s3: {
    enabled: parseEnvBoolean(process.env.S3_ENABLED, false),
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? 'access-key-id',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? 'secret-access-key',
    endpoint: process.env.S3_ENDPOINT ?? 'endpoint',
    region: process.env.S3_REGION ?? 'region',
    buckets: {
      [FileKind.Attachment]: process.env.S3_BUCKET_NAME_ATTACHMENTS ?? 'attachments',
      [FileKind.InfoDoc]: process.env.S3_BUCKET_NAME_DOCUMENTS ?? 'documents',
      [FileKind.ProfileImage]: process.env.S3_BUCKET_NAME_DOCUMENTS ?? 'documents',
      [FileKind.StudyDoc]: process.env.S3_BUCKET_NAME_PROFILE_IMAGES ?? 'profile-images',
      [FileKind.TeamFile]: process.env.S3_BUCKET_NAME_TEAM_FILES ?? 'team-files',
      [FileKind.TeamGallery]: process.env.S3_BUCKET_NAME_TEAM_GALLERIES ?? 'team-galleries',
      [FileKind.TeamReceipt]: process.env.S3_BUCKET_NAME_TEAM_RECEIPTS ?? 'team-receipts',
      [FileKind.Tenant]: process.env.S3_BUCKET_NAME_TENANTS ?? 'tenants',
    },
  },
  redis: {
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
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? 'secret',
    accessTokenExpirationSeconds: parseEnvInt(process.env.ACCESS_TOKEN_EXPIRATION_SECONDS, 28_800),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? 'secret',
    refreshTokenExpirationSeconds: parseEnvInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS, 604_800),
    wsTokenSecret: process.env.WS_TOKEN_SECRET ?? 'secret',
    wsTokenExpirationSeconds: parseEnvInt(process.env.WS_TOKEN_EXPIRATION_SECONDS, 30),
    botTokenSecret: process.env.BOT_TOKEN_SECRET ?? 'secret',
  },
  cookies: {
    signature: process.env.COOKIE_SIGNATURE_SECRET ?? 'secret',
    // This is only the default value, the real value is set right after the config is initialized.
    options: {
      signed: true,
      secure: nodeEnv === 'production',
      httpOnly: true,
      // eslint-disable-next-line no-undefined
      domain: nodeEnv === 'production' ? `.${baseDomain}` : undefined,
    } as CookieOptions,
  },
  session: {
    secret: process.env.SESSION_SECRET ?? 'secret',
  },
  adminAccount: {
    username: process.env.ADMIN_ACCOUNT_USERNAME ?? 'okampus-admin',
    email: process.env.ADMIN_ACCOUNT_EMAIL ?? 'admin@okampus.fr',
    firstName: process.env.ADMIN_ACCOUNT_FIRST_NAME ?? 'Okampus',
    lastName: process.env.ADMIN_ACCOUNT_LAST_NAME ?? 'Admin',
    password: process.env.ADMIN_ACCOUNT_PASSWORD ?? 'root',
  },
  anonAccount: {
    username: process.env.ANON_ACCOUNT_USERNAME ?? 'okampus-anon',
    email: process.env.ANON_ACCOUNT_EMAIL ?? 'anon@okampus.fr',
    firstName: process.env.ANON_ACCOUNT_FIRST_NAME ?? 'Anonyme',
    lastName: process.env.ANON_ACCOUNT_LAST_NAME ?? '',
    password: process.env.ANON_ACCOUNT_PASSWORD ?? 'root',
  },
  settings: {
    metricsCron: process.env.METRICS_CRON ?? '*/15 * * * *',
  },
} as const;
