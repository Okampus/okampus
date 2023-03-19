// eslint-disable-next-line import/no-cycle
import { ProjectModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { FileUploadModel } from '../../index';
import { IndividualModel } from '../../index';
import { TenantScopedModel } from '../../index';
import { TenantEventModel } from '../../index';
import { TeamModel } from '../../index';

import { FinanceCategory, FinanceState, PaymentMethod } from '@okampus/shared/enums';
import { Address } from '@okampus/shared/dtos';
import { Field, Float, ObjectType } from '@nestjs/graphql';

import type { IFileUpload, IFinance, IIndividual, IProject, ITeam, ITenantEvent } from '@okampus/shared/dtos';

@ObjectType()
export class FinanceModel extends TenantScopedModel implements IFinance {
  @Field(() => String)
  transaction!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => Address, { nullable: true })
  address!: Address | null;

  @Field(() => Date)
  paymentDate!: Date;

  @Field(() => PaymentMethod)
  paymentMethod!: PaymentMethod;

  @Field(() => Float)
  amountDue!: number;

  @Field(() => Float)
  amountPayed!: number;

  @Field(() => FinanceState)
  state!: FinanceState;

  @Field(() => FinanceCategory)
  category!: FinanceCategory;

  @Field(() => TeamModel)
  team!: ITeam;

  @Field(() => IndividualModel)
  createdBy!: IIndividual;

  @Field(() => TenantEventModel, { nullable: true })
  linkedEvent: ITenantEvent | null = null;

  @Field(() => ProjectModel, { nullable: true })
  linkedProject: IProject | null = null;

  @Field(() => [FileUploadModel])
  receipts: IFileUpload[] = [];

  constructor(finance: IFinance) {
    if (!finance.tenant) throw new Error('Finance must have a tenant');
    super(finance.tenant);
    this.assign(finance);
  }
}

@ObjectType()
export class PaginatedFinanceModel extends Paginated(FinanceModel) {}
