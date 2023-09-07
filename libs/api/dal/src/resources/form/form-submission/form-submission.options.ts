import type { Form } from '../form.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { FormSubmissionProps } from './form-submission.props';

export type FormSubmissionOptions = FormSubmissionProps &
  TenantScopedOptions & {
    form: Form;
  };
