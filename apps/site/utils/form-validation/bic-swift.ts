const bicSwiftRegex = /^[A-Z]{6}[\dA-Z]{2}([\dA-Z]{3})?$/;

export async function validateBicSwift(value: string) {
  if (!bicSwiftRegex.test(value))
    throw new Error('BIC/SWIFT invalide. Formats valides : AAAABB11222 ou AAAA-BB-11-222.');
}
