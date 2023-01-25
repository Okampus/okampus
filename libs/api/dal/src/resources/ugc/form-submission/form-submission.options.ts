import { FormSubmissionProps } from '@okampus/shared/dtos';
import { Form } from '../form/form.entity';
import { UgcOptions } from '../ugc.options';

export type FormSubmissionOptions = FormSubmissionProps &
  UgcOptions & {
    forForm?: Form;
  };
