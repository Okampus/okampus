import { TenantEventProps } from '@okampus/shared/dtos';
import { Individual } from '../../actor/individual/individual.entity';
import { User } from '../../actor/user/user.entity';
import { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import { EventApprovalStep } from '../../manage-tenant/event-approval-step/event-approval-step.entity';
import { Org } from '../../org/org.entity';
import { FormSubmission } from '../../ugc/form-submission/form-submission.entity';
import { Form } from '../../ugc/form/form.entity';
import { ContentMasterOptions } from '../content-master.options';
import type { TenantEvent } from './event.entity';

export type TenantEventOptions = TenantEventProps &
  Omit<ContentMasterOptions, 'rootContent'> & {
    description?: string;
    createdBy: Individual;
    image?: ImageUpload | null;
    org?: Org | null;
    supervisor: User;
    joinForm?: Form | null;
    regularEvent?: TenantEvent | null;
    approvalSubmission?: FormSubmission | null;
    lastEventApprovalStep?: EventApprovalStep | null;
  };
