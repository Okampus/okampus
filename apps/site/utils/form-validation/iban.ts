import isIBAN from 'validator/lib/isIBAN';

export function validateIBAN(value: string) {
  let isValid = false;
  try {
    isValid = isIBAN(value);
  } catch {
    isValid = false;
  }
  if (!isValid) return 'IBAN invalide.';
  return true;
}
