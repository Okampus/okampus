import type { IIndividual } from '../../actor/individual/individual.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { EventApprovalStepProps } from './event-approval-step.props';
import type { ITenant } from '../../org/tenant/tenant/tenant.interface';
import type { IUser } from '../../actor/user/user.interface';

export type IEventApprovalStep = ITenantScoped &
  EventApprovalStepProps & {
    createdBy?: IIndividual | null;
    linkedTenant?: ITenant;
    stepOrder: number;
    validators: IIndividual[];
    notifiees: IUser[];
  };
