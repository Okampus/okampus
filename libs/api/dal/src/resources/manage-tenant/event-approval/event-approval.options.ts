import type { EventApprovalProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../../actor/individual/individual.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';

export type EventApprovalOptions = EventApprovalProps &
  TenantScopedOptions & {
    event: TenantEvent;
    createdBy: Individual;
    step: EventApprovalStep;
  };
