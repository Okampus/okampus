// eslint-disable-next-line import/no-cycle
import { ProjectModel } from './project.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { FileUploadModel } from '../../abstract/file-upload.model';
import { IndividualModel } from '../../abstract/individual.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { TenantEventModel } from '../events/event.model';
import { TeamModel } from '../teams/team.model';
import { FinanceCategory, FinanceState, PaymentMethod } from '@okampus/shared/enums';
import { Address } from '@okampus/shared/dtos';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import type {
  IFileUpload,
  IFinance,
  IForm as Finance,
  IIndividual,
  IProject,
  ITeam,
  ITenantEvent,
} from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

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

  constructor(finance: Finance) {
    super(finance.tenant as TenantCore);
    this.assign(finance);
  }
}

@ObjectType()
export class PaginatedFinanceModel extends Paginated(FinanceModel) {}
