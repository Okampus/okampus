import type { ActionType } from './action.props';
import type { Submission } from '../../global/form-field.interface';

export type SubmitOptions<T> = {
  label?: string;
  type: ActionType;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onSubmit: (data: Submission<T>) => void;
};

export type FormRenderProps<T> = {
  title: string;
  schema: T;
  submitOptions: SubmitOptions<T>;
};
