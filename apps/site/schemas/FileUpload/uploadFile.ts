import { S3BucketNames } from '@okampus/shared/enums';
import { z } from 'zod';

export const uploadFileSchema = z.object({
  blob: z.instanceof(Blob),
  fileName: z.string().optional(),
  bucketName: z.nativeEnum(S3BucketNames),
});
