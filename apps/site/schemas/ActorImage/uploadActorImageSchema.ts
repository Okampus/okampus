import { ActorImageType } from '@prisma/client';
import { z } from 'zod';

export const uploadActorImageSchema = z.object({
  blob: z.instanceof(Blob),
  actorImageType: z.nativeEnum(ActorImageType),
});
