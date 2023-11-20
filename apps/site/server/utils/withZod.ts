'use server';

import { parseFormData } from '../../utils/form-data/parse-form-data';
import { BadRequestError } from '../error';
import { ZodError, type TypeOf, type ZodSchema } from 'zod';

type WithZodOptions<T extends ZodSchema> = {
  zodSchema: T;
  formData: FormData;
};
export async function withZod<T extends ZodSchema>({ formData, zodSchema }: WithZodOptions<T>): Promise<TypeOf<T>> {
  const data = parseFormData(formData);

  try {
    return await zodSchema.parseAsync(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of error.issues) {
        fields[issue.path[0]] = issue.message;
      }

      throw new BadRequestError('INVALID_FIELD', fields);
    }
    throw error;
  }
}
