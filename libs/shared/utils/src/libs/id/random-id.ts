export function randomId(length = 21, dictionary = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  // eslint-disable-next-line unicorn/prefer-node-protocol
  const random = typeof self === 'undefined' ? require('crypto').getRandomValues : self.crypto.getRandomValues;
  const randomBytes = random(new Uint8Array(length));
  let id = '';

  // Loop through the random bytes and convert them to characters
  for (let i = 0; i < length; i++) {
    const byte = randomBytes[i];
    const character = dictionary[byte % dictionary.length];
    id += character;
  }

  return id;
}
