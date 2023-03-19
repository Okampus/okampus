/* eslint-disable import/no-cycle */
import { EventApprovalStepModel } from '../../index';
import { TenantEventModel } from '../../index';
import { IndividualModel } from '../../index';
import { TenantScopedModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { Field, ObjectType } from '@nestjs/graphql';
import type { IEventApproval, IEventApprovalStep, IIndividual, ITenantEvent } from '@okampus/shared/dtos';

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
    if (!approval.tenant) throw new Error('Approval must have a tenant');
    super(approval.tenant);
    this.assign(approval);
  }
}

@ObjectType()
export class PaginatedEventApprovalModel extends Paginated(EventApprovalModel) {}
