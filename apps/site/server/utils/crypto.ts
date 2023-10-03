import crypto from 'node:crypto';

export function encrypt(plaintext: string, secret: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', secret, iv);
  const tag = cipher.getAuthTag();

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(ciphertext: string, secret: string) {
  const buffer = Buffer.from(ciphertext, 'base64');
  const iv = buffer.subarray(0, 16);
  const tag = buffer.subarray(16, 32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', secret, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(buffer.subarray(32)), decipher.final()]);
  return decrypted.toString('utf8');
}
