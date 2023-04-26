import type { ApprovalState } from '@okampus/shared/enums';
import type { Action } from '../../team/action/action.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { EventRole } from '../event-role/event-role.entity';
import type { Event } from '../event.entity';
import type { EventJoinProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { EventChangeRole } from '../event-change-role/event-change-role.entity';

export type EventJoinOptions = EventJoinProps &
  TenantScopedOptions & {
    eventChangeRole?: EventChangeRole | null;
    formSubmission: FormSubmission;
    joiner: UserInfo;
    event: Event;
    participated?: boolean;
    action?: Action | null;
    eventRole?: EventRole | null;
    state?: ApprovalState;
  };
