import type { FormSubmissionProps } from '@okampus/shared/dtos';
import type { FormEdit } from '../../edit/form-edit/form-edit.entity';
import type { UgcOptions } from '../ugc.options';

export type FormSubmissionOptions = FormSubmissionProps &
  UgcOptions & {
    linkedFormEdit: FormEdit;
  };
