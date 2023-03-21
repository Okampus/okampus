// eslint-disable-next-line import/no-cycle
import { TenantModel } from '../../index';
import { UserModel } from '../../index';
import { TenantScopedModel } from '../../index';
import { IndividualModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, Int, ObjectType } from '@nestjs/graphql';

import type { IEventApprovalStep, IIndividual, ITenant, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class EventApprovalStepModel extends TenantScopedModel implements IEventApprovalStep {
  @Field(() => TenantModel, { nullable: true })
  linkedTenant?: ITenant;

  @Field(() => Int)
  stepOrder!: number;

  @Field(() => String)
  name!: string;

  @Field(() => [IndividualModel])
  validators!: IIndividual[];

  @Field(() => [UserModel])
  notifiees!: IUser[];

  constructor(approvalStep: IEventApprovalStep) {
    if (!approvalStep.tenant) throw new Error('EventApprovalStep must have a tenant');
    super(approvalStep.tenant);
    this.assign(approvalStep);
  }
}

@ObjectType()
export class PaginatedEventApprovalStepModel extends Paginated(EventApprovalStepModel) {}
