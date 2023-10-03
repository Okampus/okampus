import { s3Url, s3ForcePathStyle, s3OcrEndpoint, s3OcrForcePathStyle, cookieOptions, parseEnvNumber } from '../config';
import { TokenType } from '@okampus/shared/enums';
import { S3Client } from '@aws-sdk/client-s3';

import type { CookieOptions } from '@okampus/shared/types';

const allowedAlgorithms = ['HS256', 'HS384', 'HS512'];
export const jwtAlgorithm =
  process.env.JWT_ALGORITHM && allowedAlgorithms.includes(process.env.JWT_ALGORITHM)
    ? process.env.JWT_ALGORITHM
    : 'HS256';

export const tokenSecrets = {
  [TokenType.Access]: process.env.ACCESS_TOKEN_SECRET || 'access_token_secret',
  [TokenType.Refresh]: process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret',
  [TokenType.Bot]: process.env.BOT_TOKEN_SECRET || 'bot_token_secret',
};

export const sessionSecret = process.env.SESSION_SECRET || 'session_secret';
export const oauthTokenSecret = process.env.OAUTH_TOKEN_SECRET || 'oauth_token_secret';
export const oauthCookieOptions: CookieOptions = {
  ...cookieOptions,
  maxAge: parseEnvNumber(process.env.OAUTH_COOKIE_EXPIRES, 240),
};

export const adminPassword = process.env.BASE_ADMIN_PASSWORD ?? 'root';
export const passwordHashSecret = Buffer.from(process.env.PASSWORD_PEPPER_SECRET ?? 'password_secret_pepper');
export const refreshHashSecret = Buffer.from(process.env.REFRESH_PEPPER_SECRET ?? 'refresh_secret_pepper');

export const s3Config = {
  endpoint: s3Url,
  forcePathStyle: s3ForcePathStyle,
  region: process.env.S3_REGION ?? 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? 'access-key-id',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? 'secret-access-key',
  },
};

export const s3OcrConfig = process.env.OCR_ENABLED
  ? {
      endpoint: s3OcrEndpoint,
      forcePathStyle: s3OcrForcePathStyle,
      region: process.env.OCR_REGION ?? 'us-west-3',
      credentials: {
        accessKeyId: process.env.OCR_API_KEY_ID ?? 'access-key-id',
        secretAccessKey: process.env.OCR_SECRET_ACCESS_KEY ?? 'secret-access-key',
      },
    }
  : null;

export const s3Client = new S3Client(s3Config);
export const s3OcrClient = s3OcrConfig ? new S3Client(s3OcrConfig) : null;

export const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
export const inseeApiKey = process.env.INSEE_API_TOKEN;
export const googleCustomSearchApiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;

export const seedingMode = process.env.ORM_SEEDING_MODE;
export const seedingBucket = process.env.ORM_SEEDING_BUCKET;
