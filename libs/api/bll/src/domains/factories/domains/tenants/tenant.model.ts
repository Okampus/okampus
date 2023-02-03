import { Field, ObjectType } from '@nestjs/graphql';
import { IEventApprovalStep, IForm, ITenant } from '@okampus/shared/dtos';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { OrgModel } from '../../abstract/org.model';
// eslint-disable-next-line import/no-cycle
import { EventApprovalStepModel } from '../events/event-approval-step.model';
import { FormModel } from '../forms/form.model';

@ObjectType({ implements: () => [OrgModel] })
export class TenantModel extends OrgModel implements ITenant {
  @Field(() => FormModel, { nullable: true })
  eventValidationForm?: IForm;

  @Field(() => [EventApprovalStepModel])
  eventApprovalSteps!: IEventApprovalStep[];

  constructor(tenant: Omit<ITenant, 'parent'>) {
    super({ ...tenant, parent: null });
    Object.assign(this, tenant);
  }
}

@ObjectType()
export class PaginatedTenantModel extends Paginated(TenantModel) {}