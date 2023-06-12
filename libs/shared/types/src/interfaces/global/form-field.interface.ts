import type { ControlType } from '@okampus/shared/enums';
import type { ArrayElement } from '../../types/array.type';
import type { SelectItem } from '../ui/select-item.interface';
import type { Cast } from '../../types/cast.type';
import type { DeepWriteable } from '../../types/deep-writeable.type';

type SubmissionNoReadonly<T> = T extends Array<{ name: infer Key; type: ControlType }>
  ? { [K in Cast<Key, string>]: FormFieldValue<Extract<ArrayElement<T>, { name: K }>['type']> }
  : { [key in string]: FormFieldValue<ControlType> };

export type Submission<T> = SubmissionNoReadonly<DeepWriteable<T>>;

export type FormFieldValue<Type> = Type extends
  | ControlType.Markdown
  | ControlType.Text
  | ControlType.Select
  | ControlType.DatetimeLocal
  | ControlType.SingleFile
  ? string
  : Type extends ControlType.Number | ControlType.Radio
  ? number
  : Type extends ControlType.Checkbox
  ? boolean
  : Type extends ControlType.MultiCheckbox
  ? boolean[]
  : never;

export type FormFieldType<Type extends ControlType> = {
  name: string;
  label: string;
  type: Type;
  placeholder?: string;
  default?: FormFieldValue<Type>;
  options?: SelectItem<string>[];
  isRequired?: boolean;
};

export type FormField = {
  [Type in ControlType]: FormFieldType<Type>;
}[ControlType];

export type FormSchema = Readonly<Array<FormField>>;

// export type Submission<Type extends ControlType, Field extends FormFieldType<Type>> = {
//   [key in Field['name']]: Field['isRequired'] extends true ? FormFieldValue<Type> : FormFieldValue<Type> | undefined;
// };

export function isFormSubmission<T extends FormSchema>(
  schema: T,
  data: Record<string, unknown>
): data is Submission<T> {
  for (const field of schema) {
    if (field.isRequired && !(field.name in data)) {
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
