import type { IForm } from '../../ugc/form/form.interface';
import type { IUgc } from '../ugc.interface';
import type { FormSubmissionProps } from './form-submission.props';

export type IFormSubmission = IUgc &
  FormSubmissionProps & {
    forForm?: IForm;
  };
