import { iso8601Pattern } from '@okampus/shared/utils';
import { z } from 'zod';

export const insertCashAccountSchema = z.object({
  balance: z.number().min(0),
  balanceShouldRenewFrequency: z.string().regex(iso8601Pattern),
  teamId: z.coerce.bigint(),
});
