import type { Address } from '../actor/address/address.entity';
import type { User } from '../individual/user/user.entity';
import type { Tag } from '../actor/tag/tag.entity';
import type { Team } from '../team/team.entity';
import type { Event } from './event.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { EventProps } from '@okampus/shared/dtos';
import type { FormSubmission } from '../form-submission/form-submission.entity';
import type { Form } from '../form/form.entity';
import type { Project } from '../project/project.entity';
import type { EventApprovalStep } from '../tenant/event-approval-step/event-approval-step.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { EventManage } from './event-manage/event-manage.entity';
import type { Content } from '../content/content.entity';

export type EventOptions = EventProps &
  TenantScopedOptions & {
    supervisors?: User[];
    content: Content;
    address?: Address | null;
    banner?: FileUpload | null;
    project?: Project | null;
    joinForm?: Form | null;
    regularEvent?: Event | null;
    approvalSubmission?: FormSubmission | null;
    lastEventApprovalStep?: EventApprovalStep | null;
    tags?: Tag[];
    teams?: Team[];
    eventManages?: EventManage[];
  };
