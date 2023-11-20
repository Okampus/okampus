import type { ArrayElement } from '../types/array.type';
import type { Cast } from '../types/cast.type';
import type { DeepWriteable } from '../types/deep-writeable.type';
import type { ControlType } from '@okampus/shared/enums';

export type FormDataType<Type extends ControlType> =
  | (Type extends
      | ControlType.Markdown
      | ControlType.Text
      | ControlType.Radio
      | ControlType.Select
      | ControlType.TextArea
      | ControlType.Date // Date ISO string
      ? string
      : Type extends ControlType.File
      ? File
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

export type FormSubmissionType<Type extends ControlType> = Type extends ControlType.File ? string : FormDataType<Type>;

type SubmissionDataNoReadonly<Values> = Values extends Array<{ name: infer Key; type: ControlType }>
  ? { [K in Cast<Key, string>]: FormDataType<Extract<ArrayElement<Values>, { name: K }>['type']> }
  : { [key in string]: FormDataType<ControlType> };
export type SubmissionData<Values = Array<string>> = SubmissionDataNoReadonly<DeepWriteable<Values>>;

type SubmissionTypeNoReadonly<Values> = Values extends Array<{ name: infer Key; type: ControlType }>
  ? { [K in Cast<Key, string>]: FormSubmissionType<Extract<ArrayElement<Values>, { name: K }>['type']> }
  : { [key in string]: FormSubmissionType<ControlType> };
export type SubmissionType<Values = Array<string>> = SubmissionTypeNoReadonly<DeepWriteable<Values>>;

export type FormFieldOption = { value: string; label: string };
export type FormFieldType<Type extends ControlType> = {
  name: string;
  type: Type;
  defaultValue?: FormSubmissionType<Type>;
  label?: string;
  placeholder?: string;
  required?: boolean;
} & (Type extends ControlType.Select ? { options: FormFieldOption[] } : { options?: never });

export type FormSchema = Array<FormFieldType<ControlType>>;
