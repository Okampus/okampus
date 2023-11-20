import { isIBAN } from 'class-validator';
import { z } from 'zod';

export const zodIban = z.custom<string>((value) => {
  let isValid = false;
  try {
    isValid = typeof value === 'string' && isIBAN(value);
  } catch {
    isValid = false;
  }
  if (!isValid) return 'IBAN invalide.';
  return true;
});
