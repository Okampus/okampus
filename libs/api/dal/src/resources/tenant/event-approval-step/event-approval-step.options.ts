import type { User } from '../../user/user.entity';
import type { EventApprovalStepProps } from './event-approval-step.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';

export type EventApprovalStepOptions = EventApprovalStepProps &
  TenantScopedOptions & {
    validators?: User[];
    notifiees?: User[];
  };
