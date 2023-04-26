import type { ActorAddress } from '../actor/actor-address/actor-address.entity';
import type { UserInfo } from '../individual/user-info/user-info.entity';
import type { Tag } from '../actor/tag/tag.entity';
import type { Team } from '../team/team.entity';
import type { Event } from './event.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { EventProps } from '@okampus/shared/dtos';
import type { FormSubmission } from '../form-submission/form-submission.entity';
import type { Form } from '../form/form.entity';
import type { Project } from '../project/project.entity';
import type { EventApprovalStep } from '../tenant/event-approval-step/event-approval-step.entity';
import type { Upload } from '../upload/upload';
import type { EventRole } from './event-role/event-role.entity';

export type EventOptions = EventProps &
  TenantScopedOptions & {
    image?: Upload | null;
    roles?: EventRole[];
    location: ActorAddress;
    supervisor: UserInfo;
    tags?: Tag[];
    project?: Project | null;
    joinForm?: Form | null;
    teams?: Team[];
    regularEvent?: Event | null;
    approvalSubmission?: FormSubmission | null;
    lastEventApprovalStep?: EventApprovalStep | null;
  };
