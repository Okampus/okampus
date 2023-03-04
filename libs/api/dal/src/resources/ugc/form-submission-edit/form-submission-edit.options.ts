import type { FormSubmissionEditProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../../actor/individual/individual.entity';
import type { FormSubmission } from '../form-submission/form-submission.entity';

export type FormSubmissionEditOptions = FormSubmissionEditProps &
  TenantScopedOptions & {
    linkedFormSubmission: FormSubmission;
    editedBy: Individual;
    order: number;
  };
