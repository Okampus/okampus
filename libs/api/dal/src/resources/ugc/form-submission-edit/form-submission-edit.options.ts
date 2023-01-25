import { FormSubmissionEditProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Individual } from '../../actor/individual/individual.entity';
import { FormSubmission } from '../form-submission/form-submission.entity';

export type FormSubmissionEditOptions = FormSubmissionEditProps &
  TenantScopedOptions & {
    formSubmission: FormSubmission;
    editedBy: Individual;
    order: number;
  };
