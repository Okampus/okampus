import type { FormSubmissionProps } from '@okampus/shared/dtos';
import type { Form } from '../form/form.entity';
import type { UgcOptions } from '../ugc.options';

export type FormSubmissionOptions = FormSubmissionProps &
  UgcOptions & {
    forForm?: Form;
  };
