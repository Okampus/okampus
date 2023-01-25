import { Field, ObjectType } from '@nestjs/graphql';
import { IEventApproval, IEventApprovalStep, IIndividual, ITenantCore, ITenantEvent } from '@okampus/shared/dtos';
import { Paginated } from '../../../shards/types/paginated.type';
import { IndividualModel } from '../abstract/individual.model';
import { TenantScopedModel } from '../abstract/tenant-scoped.model';
import { EventApprovalStepModel } from './event-approval-step.model';
// eslint-disable-next-line import/no-cycle
import { TenantEventModel } from './event.model';

@ObjectType()
export class EventApprovalModel extends TenantScopedModel implements IEventApproval {
  @Field(() => TenantEventModel, { nullable: true })
  event?: ITenantEvent;

  @Field(() => IndividualModel, { nullable: true })
  createdBy?: IIndividual;

  @Field(() => String, { nullable: true })
  message!: string | null;

  @Field(() => Boolean)
  approved!: boolean;

  @Field(() => EventApprovalStepModel, { nullable: true })
  step?: IEventApprovalStep;

  constructor(approval: IEventApproval) {
    super(approval.tenant as ITenantCore);
    this.assign(approval);
  }
}

@ObjectType()
export class PaginatedEventApprovalModel extends Paginated(EventApprovalModel) {}
