export async function validateWebsite(website: string) {
  if (!website) return;

  const isValid = website.match(/^(https?:\/\/)?(www\.)?([\dA-Za-z-]{2,}\.)+[\w#%&()+./:=?@~-]{2,}\/?$/);

  if (!isValid) throw new Error('Veuillez entrer une adresse de site web valide.');
}
