import { ALL } from '@okampus/shared/consts';
import { TeamType } from '@prisma/client';
import { z } from 'zod';

export const insertRequiredDocumentSchema = z.object({
  name: z.string(),
  isRequired: z.boolean(),
  teamType: z.nativeEnum(TeamType).or(z.literal(ALL)),
  description: z.string(),
});
