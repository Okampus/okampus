import { TeamPaymentMethodType } from '@prisma/client';
import { z } from 'zod';

export const insertPaymentMethodSchema = z.object({
  teamId: z.coerce.bigint(),
  name: z.string(),
  type: z.nativeEnum(TeamPaymentMethodType),
});
