import { insertRequiredDocumentSchema } from './insertRequiredDocumentSchema';
import { z } from 'zod';
export const updateRequiredDocumentSchema = insertRequiredDocumentSchema.partial().extend({
  id: z.bigint(),
});
