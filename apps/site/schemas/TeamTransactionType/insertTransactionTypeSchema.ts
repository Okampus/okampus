import { z } from 'zod';

export const insertTransactionTypeSchema = z.object({
  teamId: z.coerce.bigint(),
  name: z.string(),
  isIncome: z.boolean(),
});
