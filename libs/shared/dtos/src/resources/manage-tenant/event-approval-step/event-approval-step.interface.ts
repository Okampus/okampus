import { IIndividual } from '../../actor/individual/individual.interface';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { EventApprovalStepProps } from './event-approval-step.props';
import { ITenant } from '../../org/tenant/tenant/tenant.interface';
import { IUser } from '../../actor/user/user.interface';

export type IEventApprovalStep = ITenantScoped &
  EventApprovalStepProps & {
    createdBy?: IIndividual | null;
    tenantOrg?: ITenant;
    order: number;
    validators: IIndividual[];
    notifiees: IUser[];
  };
