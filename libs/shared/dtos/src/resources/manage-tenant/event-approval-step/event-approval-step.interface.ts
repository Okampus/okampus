import { IIndividual } from '../../actor/individual/individual.interface';
import { ITenantScopedEntity } from '../../tenant-scoped.interface';
import { EventApprovalStepProps } from './event-approval-step.props';
import { ITenant } from '../../org/tenant/tenant/tenant.interface';
import { IUser } from '../../actor/user/user.interface';

export type IEventApprovalStep = ITenantScopedEntity &
  EventApprovalStepProps & {
    tenantOrg?: ITenant;
    createdBy?: IIndividual;
    order: number;
    validators: IIndividual[];
    notifiees: IUser[];
  };
