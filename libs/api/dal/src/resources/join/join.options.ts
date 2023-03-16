import type { User } from '../actor/user/user.entity';
import type { JoinProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../actor/individual/individual.entity';
import type { FormSubmission } from '../ugc/form-submission/form-submission.entity';

export type JoinOptions = JoinProps &
  TenantScopedOptions & {
    issuer: Individual | null;
    formSubmission: FormSubmission;
    joiner: User;
  };
