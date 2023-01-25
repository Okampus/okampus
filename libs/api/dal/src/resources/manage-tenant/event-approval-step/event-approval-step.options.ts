import { EventApprovalStepProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Individual } from '../../actor/individual/individual.entity';
import { User } from '../../actor/user/user.entity';
import type { Tenant } from '../../org/tenant/tenant.entity';

export type EventApprovalStepOptions = EventApprovalStepProps &
  TenantScopedOptions & {
    createdBy: Individual;
    order?: number;
    tenantOrg: Tenant;
    validators?: Individual[];
    notifiees?: User[];
  };
