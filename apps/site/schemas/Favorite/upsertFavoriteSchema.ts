import { z } from 'zod';

export enum FavoriteType {
  Event = 'Event',
  Post = 'Post',
}

export const upsertFavoriteSchema = z.object({
  id: z.coerce.bigint(),
  type: z.nativeEnum(FavoriteType),
});
