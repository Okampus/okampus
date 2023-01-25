import type { IEventApprovalStep } from '../../../manage-tenant/event-approval-step/event-approval-step.interface';
import { IForm } from '../../../ugc/form/form.interface';
import { IOrg } from '../../org.interface';
import { TenantProps } from './tenant.props';

export type ITenant = IOrg &
  TenantProps & {
    eventApprovalSteps: IEventApprovalStep[];
    eventValidationForm?: IForm | null;
  };
