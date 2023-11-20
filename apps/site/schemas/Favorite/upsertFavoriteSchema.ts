import { z } from 'zod';

export const upsertFavoriteSchema = z.object({
  id: z.coerce.bigint(),
  type: z.union([z.literal('event'), z.literal('post')]),
});
