import type { IFormEdit } from '../../edit/form-edit/form-edit.interface';
import type { IUgc } from '../ugc.interface';
import type { FormSubmissionProps } from './form-submission.props';

export type IFormSubmission = IUgc &
  Required<FormSubmissionProps> & {
    linkedFormEdit?: IFormEdit;
  };
