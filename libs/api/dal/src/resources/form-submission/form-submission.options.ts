import type { Form } from '../form/form.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { FormSubmissionProps } from '@okampus/shared/dtos';

export type FormSubmissionOptions = FormSubmissionProps &
  TenantScopedOptions & {
    form: Form;
  };
