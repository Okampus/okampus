import { isFormSchema } from './form-schema.validator';
import type { FormSchema, SubmissionData } from '@okampus/shared/types';
import type { JsonValue } from '@prisma/client/runtime/library';

// TODO
export function isFormSubmission(
  schema: JsonValue,
  submission: Record<string, unknown>,
): submission is SubmissionData<FormSchema> {
  if (!isFormSchema(schema)) return false;
  for (const field of schema) {
    if (field.required && !(field.name in submission)) {
      return false;
    }
    // else if (
    //   [ControlType.Text, ControlType.DatetimeLocal, ControlType.SingleFile].includes(field.type) &&
    //   typeof data[field.name] !== 'string'
    // ) {
    //   return false;
    // } else if ([ControlType.Number].includes(field.type) && typeof data[field.name] !== 'number') {
    //   return false;
    // } else if (field.type === ControlType.Checkbox && typeof data[field.name] !== 'boolean') {
    //   return false;
    // } else if (field.type === ControlType.MultiCheckbox && !Array.isArray(data[field.name])) {
    //   return false;
    // }
  }

  return true;
}
