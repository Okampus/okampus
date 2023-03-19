import type { TenantEventProps } from '@okampus/shared/dtos';
import type { Individual } from '../../actor/individual/individual.entity';
import type { User } from '../../actor/user/user.entity';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { EventApprovalStep } from '../../manage-tenant/event-approval-step/event-approval-step.entity';
import type { Org } from '../../org/org.entity';
import type { FormSubmission } from '../../ugc/form-submission/form-submission.entity';
import type { Form } from '../../ugc/form/form.entity';
import type { ContentMasterOptions } from '../content-master.options';
import type { TenantEvent } from './event.entity';

export type TenantEventOptions = TenantEventProps &
  Omit<ContentMasterOptions, 'rootContent'> & {
    description?: string;
    createdBy: Individual;
    image?: ImageUpload | null;
    orgs?: Org[];
    supervisor: User;
    joinForm?: Form | null;
    regularEvent?: TenantEvent | null;
    approvalSubmission?: FormSubmission | null;
    lastEventApprovalStep?: EventApprovalStep | null;
  };
