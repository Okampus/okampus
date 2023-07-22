import iban from 'fast-iban';

export async function validateIBAN(value: string) {
  let isValid = false;
  try {
    isValid = await iban.validateIBAN(value);
  } catch {
    isValid = false;
  }
  if (!isValid) throw new Error('IBAN invalide. Veuillez vérifier votre saisie.');
}
