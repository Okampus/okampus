import type { Submission } from './form-submission.interface';
import type { SelectItem } from '../ui/select-item.interface';
import type { ControlType } from '@okampus/shared/enums';

export type FormFieldValue<Type> =
  | (Type extends
      | ControlType.Markdown
      | ControlType.Text
      | ControlType.Radio
      | ControlType.Select
      | ControlType.TextArea
      | ControlType.Date // Date ISO string
      | ControlType.File // File bigint ID stringified
      ? string
      : Type extends ControlType.Number
      ? number
      : Type extends ControlType.MultiFile
      ? string[] // File bigint ID stringified
      : Type extends ControlType.MultiCheckbox
      ? boolean[]
      : Type extends ControlType.Checkbox
      ? boolean
      : never)
  | null;

export type FormFieldType<Type extends ControlType> = {
  name: string;
  type: Type;
  defaultValue?: FormFieldValue<Type>;
  label?: string;
  placeholder?: string;
  options?: SelectItem<string>[];
  required?: boolean;
};

export type FormSchema = Readonly<Array<FormFieldType<ControlType>>>;

// export type Submission<Type extends ControlType, Field extends FormFieldType<Type>> = {
//   [key in Field['name']]: Field['required'] extends true ? FormFieldValue<Type> : FormFieldValue<Type> | undefined;
// };

export function isFormSubmission<T extends FormSchema>(
  schema: T,
  data: Record<string, unknown>,
): data is Submission<T> {
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
