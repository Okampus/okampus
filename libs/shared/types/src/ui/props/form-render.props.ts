import type { SubmissionData } from '../../global/form-field.interface';
import type { ActionType } from './action.props';

export type SubmitOptions<T> = {
  label?: string;
  type: ActionType;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onSubmit: (data: SubmissionData<T>) => void;
};

export type FormRenderProps<T> = {
  title: string;
  schema: T;
  submitOptions: SubmitOptions<T>;
};
