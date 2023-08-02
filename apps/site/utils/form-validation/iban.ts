import isIBAN from 'validator/lib/isIBAN';

export async function validateIBAN(value: string) {
  let isValid = false;
  try {
    isValid = isIBAN(value);
  } catch {
    isValid = false;
  }
  if (!isValid) throw new Error('IBAN invalide. Veuillez vérifier votre saisie.');
}
