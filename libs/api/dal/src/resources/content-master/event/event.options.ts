import type { TenantEventProps } from '@okampus/shared/dtos';
import type { User } from '../../actor/user/user.entity';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { Project } from '../../manage-team/project/project.entity';
import type { EventApprovalStep } from '../../manage-tenant/event-approval-step/event-approval-step.entity';
import type { Org } from '../../org/org.entity';
import type { EventRole } from '../../role/event-role/event-role.entity';
import type { FormSubmission } from '../../ugc/form-submission/form-submission.entity';
import type { Form } from '../../ugc/form/form.entity';
import type { ContentMasterOptions } from '../content-master.options';
import type { TenantEvent } from './event.entity';

export type TenantEventOptions = TenantEventProps &
  Omit<ContentMasterOptions, 'rootContent'> & {
    description?: string;
    image?: ImageUpload | null;
    orgs?: Org[];
    roles?: EventRole[];
    supervisor: User;
    linkedProject?: Project | null;
    joinForm?: Form | null;
    regularEvent?: TenantEvent | null;
    approvalSubmission?: FormSubmission | null;
    lastEventApprovalStep?: EventApprovalStep | null;
  };
