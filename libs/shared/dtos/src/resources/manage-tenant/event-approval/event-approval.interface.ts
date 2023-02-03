import { ITenantScoped } from '../../tenant-scoped.interface';
import { EventApprovalProps } from './event-approval.props';
import { ITenantEvent } from '../../content-master/event/event.interface';
import { IIndividual } from '../../actor/individual/individual.interface';
import { IEventApprovalStep } from '../event-approval-step/event-approval-step.interface';

export type IEventApproval = ITenantScoped &
  EventApprovalProps & {
    event?: ITenantEvent;
    createdBy?: IIndividual;
    step?: IEventApprovalStep;
  };
