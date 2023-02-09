import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { EventApprovalProps } from './event-approval.props';
import type { ITenantEvent } from '../../content-master/event/event.interface';
import type { IIndividual } from '../../actor/individual/individual.interface';
import type { IEventApprovalStep } from '../event-approval-step/event-approval-step.interface';

export type IEventApproval = ITenantScoped &
  Required<EventApprovalProps> & {
    event?: ITenantEvent;
    createdBy?: IIndividual;
    step?: IEventApprovalStep;
  };
