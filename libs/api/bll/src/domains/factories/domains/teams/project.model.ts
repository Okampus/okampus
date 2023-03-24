// eslint-disable-next-line import/no-cycle
import { TeamMemberModel, TeamModel, TenantEventModel, TenantScopedModel, UserModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { ObjectType, Field, Float } from '@nestjs/graphql';

import type { IProject, ITeam, ITeamMember, ITenantEvent, IUser } from '@okampus/shared/dtos';

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

  @Field(() => Boolean)
  isPrivate!: boolean;

  @Field(() => TeamModel)
  team!: ITeam;

  @Field(() => [TenantEventModel])
  linkedEvents!: ITenantEvent[];

  @Field(() => [TeamMemberModel])
  supervisors!: ITeamMember[];

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
