import { IForm } from '../../ugc/form/form.interface';
import { IUgc } from '../ugc.interface';
import { FormSubmissionProps } from './form-submission.props';

export type IFormSubmission = IUgc &
  FormSubmissionProps & {
    forForm?: IForm;
  };
