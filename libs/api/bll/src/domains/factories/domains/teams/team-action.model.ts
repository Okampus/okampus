// eslint-disable-next-line import/no-cycle
import { TeamMemberModel } from './team-member.model';
import { TeamModel } from './team.model';
import { ProjectModel } from './project.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { TenantEventModel } from '../events/event.model';
import { UserModel } from '../users/user.model';
import { IndividualModel } from '../../abstract/individual.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApprovalState } from '@okampus/shared/enums';

import type { IIndividual, IProject, ITeam, ITeamAction, ITeamMember, ITenantEvent, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class TeamActionModel extends TenantScopedModel implements ITeamAction {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => ApprovalState)
  state!: ApprovalState;

  @Field(() => Int)
  score!: number;

  @Field(() => TeamModel, { nullable: true })
  team?: ITeam;

  @Field(() => UserModel, { nullable: true })
  user?: IUser;

  @Field(() => TeamMemberModel, { nullable: true })
  teamMember?: ITeamMember | null;

  @Field(() => TenantEventModel, { nullable: true })
  linkedEvent?: ITenantEvent | null;

  @Field(() => ProjectModel, { nullable: true })
  linkedProject?: IProject | null;

  @Field(() => IndividualModel, { nullable: true })
  createdBy?: IIndividual;

  @Field(() => TeamMemberModel, { nullable: true })
  validatedBy?: ITeamMember | null;

  constructor(teamAction: ITeamAction) {
    if (!teamAction.tenant) throw new Error('TeamAction must have a tenant');
    super(teamAction.tenant);
    this.assign(teamAction);
  }
}

@ObjectType()
export class PaginatedTeamActionModel extends Paginated(TeamActionModel) {}
