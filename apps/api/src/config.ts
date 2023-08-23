import { BASE_TENANT } from '@okampus/shared/consts';
import { BucketNames, TokenType } from '@okampus/shared/enums';

import dotenv from 'dotenv';

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ApiConfig } from '@okampus/shared/types';

export let rootPath = typeof __dirname === 'undefined' ? dirname(fileURLToPath(import.meta.url)) : __dirname;
while (rootPath !== '/') {
  const filePath = join(rootPath, 'pnpm-lock.yaml');
  if (existsSync(filePath)) break;
  rootPath = dirname(rootPath);
}

if (rootPath === '/') throw new Error('Could not find project root path, exiting...');

console.log('Project root path:', rootPath);

const appPath = join(rootPath, 'apps', 'api');

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

// Shortcuts
const nodeEnv = process.env.NODE_ENV ?? 'development';
const baseDomain = nodeEnv === 'production' ? 'okampus.fr' : 'localhost';
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
    baseDomain,
    frontendOriginUrl,
    apiUrl: nodeEnv === 'development' ? `http://localhost:${port}` : `https://api.okampus.fr`,
    hasuraUrl: nodeEnv === 'development' ? 'http://localhost:8080' : `https://hasura.${baseDomain}`,
    frontendUrl: nodeEnv === 'development' ? 'http://localhost:3000' : `https://okampus.fr`,
  },
  meilisearch: {
    host: process.env.MEILISEARCH_HOST ?? 'localhost:7700',
    apiKey: process.env.MEILISEARCH_MASTER_KEY ?? 'master-key',
  },
  textract: {
    accessKey: process.env.TEXTRACT_API_KEY_ID ?? 'api-key-id',
    secretKey: process.env.TEXTRACT_SECRET_ACCESS_KEY ?? 'api-key-secret',
    region: process.env.TEXTRACT_REGION ?? 'region',
  },
  geoapify: {
    isEnabled: parseEnvBoolean(process.env.GEOAPIFY_ENABLED, false),
    apiKey: process.env.GEOAPIFY_API_KEY ?? 'api-key',
  },
  google: {
    customSearchApiKey: process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ?? 'api-key',
  },
  insee: {
    apiToken: process.env.INSEE_API_TOKEN ?? 'api-key',
  },
  database: {
    isSeeding: parseEnvBoolean(process.env.ORM_SEEDING_ENABLED, false),
    host: process.env.PSQL_HOST ?? 'localhost',
    name: process.env.PSQL_DATABASE ?? 'db-name',
    user: process.env.PSQL_USERNAME ?? 'user',
    password: process.env.PSQL_PASSWORD ?? 'secret-db-user',
    port: parseEnvInt(process.env.PSQL_PORT, 5432),
  },
  s3: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? 'access-key-id',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? 'secret-access-key',
    },
    rawEndpoint: process.env.S3_ENDPOINT ?? 'localhost:9000',
    endpoint: parseEnvBoolean(process.env.S3_FORCE_PATH_STYLE, false)
      ? `http://${process.env.S3_ENDPOINT ?? 'localhost:9000'}`
      : `https://${process.env.S3_ENDPOINT ?? 'localhost:9000'}`,
    region: process.env.S3_REGION ?? 'eu-west-2',
    forcePathStyle: parseEnvBoolean(process.env.S3_FORCE_PATH_STYLE, false),
    bucketNames: {
      [BucketNames.ActorDocuments]: process.env.S3_BUCKET_NAME_ACTOR_DOCUMENTS ?? 'actor-documents',
      [BucketNames.ActorImages]: process.env.S3_BUCKET_NAME_ACTOR_IMAGES ?? 'actor-images',
      [BucketNames.ActorVideos]: process.env.S3_BUCKET_NAME_ACTOR_VIDEOS ?? 'actor-videos',
      [BucketNames.Attachments]: process.env.S3_BUCKET_NAME_ATTACHMENTS ?? 'attachments',
      [BucketNames.Banners]: process.env.S3_BUCKET_NAME_BANNERS ?? 'banners',
      [BucketNames.QR]: process.env.S3_BUCKET_NAME_QR ?? 'qr-codes',
      [BucketNames.Receipts]: process.env.S3_BUCKET_NAME_RECEIPTS ?? 'receipts',
      [BucketNames.Signatures]: process.env.S3_BUCKET_NAME_SIGNATURES ?? 'signatures',
      [BucketNames.Thumbnails]: process.env.S3_BUCKET_NAME_THUMBNAILS ?? 'thumbnails',
    },
    bucketSeeding: process.env.ORM_SEEDING_BUCKET ?? '',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseEnvInt(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD ?? '',
  },
  sentry: {
    isEnabled: parseEnvBoolean(process.env.SENTRY_ENABLED, false),
    dsn: process.env.SENTRY_DSN ?? 'https://sentry.io',
  },
  novu: {
    isEnabled: parseEnvBoolean(process.env.NOVU_ENABLED, false),
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
    // This is only the default value, the real value is set right after the config is initialized.
    options: {
      signed: true,
      secure: nodeEnv === 'production',
      path: '/',
      httpOnly: true,
      // eslint-disable-next-line no-undefined
      domain: nodeEnv === 'production' ? `.${baseDomain}` : undefined,
      sameSite: 'lax',
    },
  },
  session: {
    secret: process.env.SESSION_SECRET ?? 'session_secret',
  },
  jwt: {
    algorithm: process.env.JWT_ALGORITHM ?? 'HS256',
    hasuraSecret: process.env.HASURA_JWT_SECRET ?? 'very_secret_and_long_hasura_jwt_secret',
  },
  pepperSecret: process.env.PEPPER_SECRET ?? 'very_secret_and_long_pepper_secret',
  hasuraAdminSecret: process.env.HASURA_GRAPHQL_ADMIN_SECRET ?? 'very_secret_and_long_HASURA_GRAPHQL_ADMIN_SECRET',
  baseTenant: {
    adminPassword: process.env.BASE_TENANT_ADMIN_PASSWORD ?? 'root',
    domain: process.env.BASE_TENANT_DOMAIN ?? BASE_TENANT,
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
};
