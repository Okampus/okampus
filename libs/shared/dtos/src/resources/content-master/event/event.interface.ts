import type { IContentMaster } from '../content-master.interface';
import type { TenantEventProps } from './event.props';
import type { IImageUpload } from '../../file-upload/image-upload/image-upload.interface';
import type { IForm } from '../../ugc/form/form.interface';
import type { IUser } from '../../actor/user/user.interface';
import type { IFormSubmission } from '../../ugc/form-submission/form-submission.interface';
import type { IEventApprovalStep } from '../../manage-tenant/event-approval-step/event-approval-step.interface';
import type { IEventApproval } from '../../manage-tenant/event-approval/event-approval.interface';
import type { IEventJoin } from '../../join/event-join/event-join.interface';

export type ITenantEvent = IContentMaster &
  TenantEventProps & {
    image?: IImageUpload | null;
    supervisor?: IUser;
    joinForm?: IForm | null;
    regularEvent?: ITenantEvent | null;
    approvalSubmission?: IFormSubmission | null;
    lastEventApprovalStep?: IEventApprovalStep | null;
    eventApprovals: IEventApproval[];
    registrations: IEventJoin[];
  };
