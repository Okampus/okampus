import type { EventApprovalStepProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../../actor/individual/individual.entity';
import type { User } from '../../actor/user/user.entity';
import type { Tenant } from '../../org/tenant/tenant.entity';

export type EventApprovalStepOptions = EventApprovalStepProps &
  TenantScopedOptions & {
    linkedTenant: Tenant;
    validators?: Individual[];
    notifiees?: User[];
  };
