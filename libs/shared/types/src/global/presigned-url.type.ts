import type { S3BucketNames, OCRBucketNames, S3Providers } from '@okampus/shared/enums';
export type PresignedUrl = { provider: S3Providers; url: string; key: string; bucket: S3BucketNames | OCRBucketNames };
