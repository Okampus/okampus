import type { FormSubmissionEditProps } from './form-submission-edit.props';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { IFormEdit } from '../form-edit/form-edit.interface';

export type IFormSubmission = ITenantScoped &
  Required<FormSubmissionEditProps> & {
    linkedFormVersion?: IFormEdit;
  };
