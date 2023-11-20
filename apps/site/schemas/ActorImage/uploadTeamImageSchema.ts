import { uploadActorImageSchema } from './uploadActorImageSchema';
import { z } from 'zod';

export const uploadTeamImageSchema = uploadActorImageSchema.extend({ teamId: z.bigint() });
