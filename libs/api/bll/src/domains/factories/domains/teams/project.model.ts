// eslint-disable-next-line import/no-cycle
import { TeamModel } from './team.model';
// eslint-disable-next-line import/no-cycle
import { TenantEventModel } from '../events/event.model';
import { UserModel } from '../users/user.model';
import { IndividualModel } from '../../abstract/individual.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import type { IIndividual, IProject, ITeam, ITenantCore, ITenantEvent, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class ProjectModel extends TenantScopedModel implements IProject {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => Float)
  expectedBudget!: number;

  @Field(() => Float)
  actualBudget!: number;

  @Field(() => TeamModel)
  team!: ITeam;

  @Field(() => TenantEventModel, { nullable: true })
  linkedEvent: ITenantEvent | null = null;

  @Field(() => IndividualModel)
  createdBy!: IIndividual;

  @Field(() => UserModel)
  supervisor!: IUser;

  @Field(() => [UserModel], { nullable: true })
  participants!: IUser[];

  constructor(project: IProject) {
    super(project.tenant as ITenantCore);
    this.assign(project);
  }
}

@ObjectType()
export class PaginatedProjectModel extends Paginated(ProjectModel) {}
