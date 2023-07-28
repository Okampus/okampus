import type { Individual } from '../../individual/individual.entity';
import type { EventApprovalStepProps } from './event-approval-step.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type EventApprovalStepOptions = EventApprovalStepProps &
  TenantScopedOptions & {
    validators?: Individual[];
    notifiees?: Individual[];
  };
