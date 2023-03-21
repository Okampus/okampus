import type { FormSubmissionEditProps } from './form-submission-edit.props';
import type { IFormEdit } from '../form-edit/form-edit.interface';
import type { IEdit } from '../edit.interface';

export type IFormSubmissionEdit = IEdit &
  Required<FormSubmissionEditProps> & {
    linkedFormEdit?: IFormEdit;
  };
