import type { EventApprovalValidatorProps } from './event-approval-validator.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';
import type { User } from '../../user/user.entity';

export type EventApprovalValidatorOptions = EventApprovalValidatorProps &
  TenantScopedOptions & {
    step: EventApprovalStep;
    user: User;
  };
