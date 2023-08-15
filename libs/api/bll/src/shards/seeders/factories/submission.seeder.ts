import { ControlType } from '@okampus/shared/enums';
import { randomInt } from '@okampus/shared/utils';
import type { FormSchema, Submission } from '@okampus/shared/types';

export function generateRandomSubmission<T extends FormSchema>(schema: T): Submission<T> {
  const data: Record<string, unknown> = {};

  for (const field of schema) {
    switch (field.type) {
      case ControlType.Radio: {
        data[field.name] = field.options ? randomInt(0, field.options.length - 1) : 0;
        break;
      }
      case ControlType.Select: {
        data[field.name] = field.options ? randomInt(0, field.options.length - 1) : 0;
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
        data[field.name] = randomInt(0, 1) === 1;
        break;
      }
      case ControlType.MultiCheckbox: {
        const selectedOptions = field.options?.map((_) => false) || [];
        if (field.options) selectedOptions[randomInt(0, field.options.length - 1)] = true;

        data[field.name] = selectedOptions;
        break;
      }
      case ControlType.Number: {
        data[field.name] = randomInt(0, 100).toString();
        break;
      }
      default: {
        data[field.name] = field.defaultValue || null;
        break;
      }
    }
  }

  return data as Submission<T>;
}
