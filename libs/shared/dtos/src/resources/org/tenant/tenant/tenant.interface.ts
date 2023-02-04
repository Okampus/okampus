import type { IOrgDocument } from '../../../manage-org/org-document/org-document.interface';
import type { IEventApprovalStep } from '../../../manage-tenant/event-approval-step/event-approval-step.interface';
import type { IForm } from '../../../ugc/form/form.interface';
import type { IOrg } from '../../org.interface';
import type { TenantProps } from './tenant.props';

export type ITenant = IOrg &
  TenantProps & {
    eventApprovalSteps: IEventApprovalStep[];
    eventValidationForm?: IForm | null;
    documents: IOrgDocument[];
  };
