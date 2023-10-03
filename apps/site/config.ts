import { S3BucketNames, OCRBucketNames, TokenType } from '@okampus/shared/enums';
import type { CookieOptions } from '@okampus/shared/types';

export const parseEnvNumber = (value: string | undefined, defaultValue: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

export const parseEnvBoolean = (value: string | undefined, defaultValue = false): boolean => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return defaultValue;
};

export const bucketNames = {
  [S3BucketNames.ActorDocuments]: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_ACTOR_DOCUMENTS ?? 'actor-documents',
  [S3BucketNames.ActorImages]: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_ACTOR_IMAGES ?? 'actor-images',
  [S3BucketNames.ActorVideos]: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_ACTOR_VIDEOS ?? 'actor-videos',
  [S3BucketNames.Attachments]: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_ATTACHMENTS ?? 'attachments',
  [S3BucketNames.Banners]: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_BANNERS ?? 'banners',
  [S3BucketNames.QR]: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_QR ?? 'qr-codes',
  [S3BucketNames.Signatures]: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_SIGNATURES ?? 'signatures',
  [S3BucketNames.Thumbnails]: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_THUMBNAILS ?? 'thumbnails',
};

export const ocrBucketNames = {
  [OCRBucketNames.Receipts]: process.env.NEXT_PUBLIC_OCR_BUCKET_NAME_RECEIPTS ?? 'okampus-receipts',
};

export const s3Providers = { S3: 's3', OCR: 'ocr' };

export const s3Provider = process.env.NEXT_PUBLIC_S3_PROVIDER ?? 'minio';
export const s3Endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT ?? 'localhost:9000';
export const s3ForcePathStyle = process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE === 'true';

export const isOcrEnabled = parseEnvBoolean(process.env.NEXT_PUBLIC_OCR_ENABLED);

export const s3OcrProvider = process.env.NEXT_PUBLIC_OCR_S3_PROVIDER;
export const s3OcrEndpoint = process.env.NEXT_PUBLIC_OCR_S3_ENDPOINT;
export const s3OcrForcePathStyle = parseEnvBoolean(process.env.NEXT_PUBLIC_OCR_S3_FORCE_PATH_STYLE);

export const isProduction = process.env.NODE_ENV === 'production';
export const protocol = isProduction ? 'https' : 'http';
export const baseUrl = process.env.NEXT_PUBLIC_BASE_ENDPOINT ?? 'localhost:3000';
export const hasuraEndpoint = process.env.NEXT_PUBLIC_HASURA_FQDN ?? 'localhost:8080';

export const s3Url = `${parseEnvBoolean(process.env.NEXT_PUBLIC_S3_LOCAL, true) ? 'http' : 'https'}://${s3Endpoint}`;
export const nextUrl = `${protocol}://${baseUrl}`;
export const trpcUrl = `${protocol}://${baseUrl}/api/trpc`;
export const hasuraUrlEndpoint = `${protocol}://${hasuraEndpoint}/v1/graphql`;
export const hasuraWsUrl = `ws://${hasuraEndpoint}/v1/graphql`;

export const cookieOptions: CookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction,
  domain: isProduction ? `.okampus.fr` : undefined,
};

export const safeCookieOptions: CookieOptions = { ...cookieOptions, httpOnly: false };

export const expirations = {
  [TokenType.Access]: parseEnvNumber(process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRATION_SECONDS, 5 * 60),
  [TokenType.Refresh]: parseEnvNumber(process.env.RNEXT_PUBLIC_EFRESH_TOKEN_EXPIRATION_SECONDS, 24 * 60 * 60),
};

export const accessCookieOptions: CookieOptions = { ...cookieOptions, maxAge: expirations[TokenType.Access] };
export const refreshCookieOptions: CookieOptions = { ...cookieOptions, maxAge: expirations[TokenType.Refresh] };
export const expiredCookieOptions: CookieOptions = { ...cookieOptions, maxAge: 0 };

export const baseTenantDomain = process.env.NEXT_PUBLIC_ORM_TENANT_DOMAIN;
