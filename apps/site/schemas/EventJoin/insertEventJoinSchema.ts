import { z } from 'zod';

export const insertEventJoinSchema = z.object({
  eventId: z.bigint(),
  submission: z.record(z.string(), z.any()).optional(),
});
