import { EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { z } from 'zod';

export const getPresignedUrlsDto = z.object({
  count: z.number().gte(1).lte(5),
  bucket: z.nativeEnum(S3BucketNames),
  entityName: z.nativeEnum(EntityNames),
  tenantScopeId: z.string(),
  createdById: z.string().optional(),
});
