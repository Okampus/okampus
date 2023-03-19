// eslint-disable-next-line import/no-cycle
import { TeamModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { TenantEventModel } from '../../index';

import { UserModel } from '../../index';
import { IndividualModel } from '../../index';
import { TenantScopedModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { ObjectType, Field, Float } from '@nestjs/graphql';
import type { IIndividual, IProject, ITeam, ITenantEvent, IUser } from '@okampus/shared/dtos';

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
    if (!project.tenant) throw new Error('Project must have a tenant');
    super(project.tenant);
    this.assign(project);
  }
}

@ObjectType()
export class PaginatedProjectModel extends Paginated(ProjectModel) {}
