export function randomId(length = 21, dictionary = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  // Create an array to store random bytes
  const randomBytes = new Uint8Array(length);

  // Fill the array with cryptographically secure random values
  crypto.getRandomValues(randomBytes);

  // Initialize an empty string to build the ID
  let id = '';

  // Loop through the random bytes and convert them to characters
  for (let i = 0; i < length; i++) {
    // Get the current random byte
    const byte = randomBytes[i];

    // Map the random byte to a character from the character set
    const character = dictionary[byte % dictionary.length];

    // Append the character to the ID string
    id += character;
  }

  return id;
}
