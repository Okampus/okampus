export async function required(value: string) {
  if (!value) throw new Error('Veuillez entrer une valeur.');
  return;
}
