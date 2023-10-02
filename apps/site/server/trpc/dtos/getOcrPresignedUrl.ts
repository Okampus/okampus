import { OCRBucketNames } from '@okampus/shared/enums';
import { z } from 'zod';

export const getOcrPresignedUrlDto = z.object({ bucket: z.nativeEnum(OCRBucketNames) });
