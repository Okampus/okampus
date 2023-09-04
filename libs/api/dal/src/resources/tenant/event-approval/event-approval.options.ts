import type { EventApprovalProps } from './event-approval.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';
import type { Event } from '../../event/event.entity';

export type EventApprovalOptions = EventApprovalProps &
  TenantScopedOptions & {
    event: Event;
    eventApprovalStep: EventApprovalStep;
  };
