import type { EventApprovalProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';
import type { Event } from '../../event/event.entity';

export type EventApprovalOptions = EventApprovalProps &
  TenantScopedOptions & {
    event: Event;
    step: EventApprovalStep;
  };
