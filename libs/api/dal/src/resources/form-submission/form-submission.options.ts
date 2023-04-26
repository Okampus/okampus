import type { FormEdit } from '../form/form-edit/form-edit.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { FormSubmissionProps } from '@okampus/shared/dtos';

export type FormSubmissionOptions = FormSubmissionProps &
  TenantScopedOptions & {
    formEdit: FormEdit;
  };
