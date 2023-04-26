import type { JSONObject } from '@okampus/shared/types';
import type { FormSubmissionEditProps } from '@okampus/shared/dtos';
import type { FormSubmission } from '../form-submission.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type FormSubmissionEditOptions = FormSubmissionEditProps &
  TenantScopedOptions & {
    addedDiff: JSONObject | null;
    formSubmission: FormSubmission;
  };
