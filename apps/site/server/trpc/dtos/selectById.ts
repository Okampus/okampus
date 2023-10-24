import { z } from 'zod';

export const selectByIdDto = z.string().transform((id) => {
  if (id.length < 6) throw new Error('Snowflake ID must have at least 6 digits.');
  try {
    return BigInt(id);
  } catch {
    throw new Error('Snowflake must be a correct BigInt.');
  }
});
