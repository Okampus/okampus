import { ControlType } from '@okampus/shared/enums';
import type { FormSchema, SubmissionType } from '@okampus/shared/types';

export function isFormSubmission<T extends FormSchema>(
  schema: T,
  data: Record<string, unknown>,
): data is SubmissionType<T> {
  for (const field of schema) {
    if (field.required && !(field.name in data)) {
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

export function defaultFormData<T extends FormSchema>(schema: T): SubmissionType<T> {
  const data: Record<string, unknown> = {};
  for (const field of schema) {
    switch (field.type) {
      case ControlType.Radio: {
        data[field.name] = field.defaultValue || 0;
        break;
      }
      case ControlType.Select: {
        data[field.name] = field.defaultValue || 0;
        break;
      }
      case ControlType.Text: {
        data[field.name] = field.defaultValue || '';
        break;
      }
      case ControlType.Markdown: {
        data[field.name] = field.defaultValue || '';
        break;
      }
      case ControlType.Checkbox: {
        data[field.name] = field.defaultValue || false;
        break;
      }
      case ControlType.MultiCheckbox: {
        data[field.name] = field.defaultValue || field.options?.map((_) => false);
        break;
      }
      case ControlType.Number: {
        data[field.name] = field.defaultValue || '0';
        break;
      }
      default: {
        data[field.name] = field.defaultValue;
      }
    }
  }

  if (!isFormSubmission(schema, data)) throw new Error('Invalid form data');
  return data as SubmissionType<T>;
}
