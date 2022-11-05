import * as crypto from 'node:crypto';

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: crypto.randomBytes(16).toString('base64'),
  }
});
