// eslint-disable-next-line import/no-cycle
import { TenantModel } from '../tenants/tenant.model';
import { UserModel } from '../users/user.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { IndividualModel } from '../../abstract/individual.model';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, Int, ObjectType } from '@nestjs/graphql';

import type { IEventApprovalStep, IIndividual, ITenant, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class EventApprovalStepModel extends TenantScopedModel implements IEventApprovalStep {
  @Field(() => TenantModel, { nullable: true })
  tenantOrg?: ITenant;

  @Field(() => IndividualModel, { nullable: true })
  createdBy: IIndividual | null = null;

  @Field(() => Int)
  order!: number;

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
