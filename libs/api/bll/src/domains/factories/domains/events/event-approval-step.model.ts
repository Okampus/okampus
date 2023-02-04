import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { IEventApprovalStep, IIndividual, ITenant, ITenantCore, IUser } from '@okampus/shared/dtos';
import { Paginated } from '../../../../shards/types/paginated.type';
import { IndividualModel } from '../../abstract/individual.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
// eslint-disable-next-line import/no-cycle
import { TenantModel } from '../tenants/tenant.model';
import { UserModel } from '../users/user.model';

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
    super(approvalStep.tenant as ITenantCore);
    this.assign(approvalStep);
  }
}

@ObjectType()
export class PaginatedEventApprovalStepModel extends Paginated(EventApprovalStepModel) {}
