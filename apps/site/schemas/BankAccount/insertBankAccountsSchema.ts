import { insertBankAccountSchema } from './insertBankAccountSchema';
import { z } from 'zod';

export const insertBankAccountsSchema = z.object({
  teamId: z.coerce.bigint(),
  institutionId: z.string(),
  accounts: insertBankAccountSchema.array(),
});
