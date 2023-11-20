import { zodIban } from '../../utils/validators/iban-validator';
import { z } from 'zod';

export const insertBankAccountSchema = z.object({
  id: z.string(),
  iban: zodIban,
  name: z.string(),
  ownerName: z.string(),
  balance: z.coerce.number(),
  details: z.string().optional(),
  referenceDate: z.coerce.date().default(() => new Date()),
});
