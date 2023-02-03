import { JoinProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Actor } from '../actor/actor.entity';
import { Individual } from '../actor/individual/individual.entity';
import { FormSubmission } from '../ugc/form-submission/form-submission.entity';

export type JoinOptions = JoinProps &
  TenantScopedOptions & {
    formSubmission?: FormSubmission;
    issuer?: Individual;
    joiner: Actor;
  };
