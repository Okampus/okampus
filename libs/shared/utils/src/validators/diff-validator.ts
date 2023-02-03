import { z } from 'zod';

const diffSchema = z.object({
  count: z.number(),
  value: z.string(),
  added: z.optional(z.boolean()),
  removed: z.optional(z.boolean()),
});
const fullDiffSchema = diffSchema.array();

export function validateDiff(form: unknown): form is object {
  return fullDiffSchema.safeParse(form).success;
}
