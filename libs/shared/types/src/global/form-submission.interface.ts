import type { FormFieldValue } from './form-field.interface';
import type { ControlType } from '@okampus/shared/enums';
import type { ArrayElement } from '../types/array.type';
import type { Cast } from '../types/cast.type';
import type { DeepWriteable } from '../types/deep-writeable.type';

type SubmissionNoReadonly<Values> = Values extends Array<{ name: infer Key; type: ControlType }>
  ? { [K in Cast<Key, string>]: FormFieldValue<Extract<ArrayElement<Values>, { name: K }>['type']> }
  : { [key in string]: FormFieldValue<ControlType> };

export type Submission<Values> = SubmissionNoReadonly<DeepWriteable<Values>>;
