import { ReactionType } from '@prisma/client';
import { z } from 'zod';

export const upsertReactionSchema = z.object({
  postId: z.coerce.bigint(),
  type: z.nativeEnum(ReactionType).optional(), // If not provided, it will default to removing the reaction
});
