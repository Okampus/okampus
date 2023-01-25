import { EventApprovalProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Individual } from '../../actor/individual/individual.entity';
import { TenantEvent } from '../../content-master/event/event.entity';
import { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';

export type EventApprovalOptions = EventApprovalProps &
  TenantScopedOptions & {
    event: TenantEvent;
    createdBy: Individual;
    step: EventApprovalStep;
  };
