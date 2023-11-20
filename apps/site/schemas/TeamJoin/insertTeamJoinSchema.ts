import { z } from 'zod';

export const insertTeamJoinSchema = z.object({
  teamId: z.bigint(),
  submission: z.record(z.string(), z.any()).optional(),
});
