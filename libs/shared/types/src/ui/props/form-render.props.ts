import type { Submission } from '../../global/form-submission.interface';
import type { ActionType } from './action.props';

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
