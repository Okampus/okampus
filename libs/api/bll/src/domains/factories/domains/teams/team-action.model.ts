// eslint-disable-next-line import/no-cycle
import { TeamMemberModel } from '../../index';
import { TeamModel } from '../../index';
import { ProjectModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { TenantScopedModel } from '../../index';
import { TenantEventModel } from '../../index';
import { UserModel } from '../../index';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApprovalState } from '@okampus/shared/enums';

import type { IProject, ITeam, ITeamAction, ITeamMember, ITenantEvent, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class TeamActionModel extends TenantScopedModel implements ITeamAction {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

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

  @Field(() => ApprovalState)
  state!: ApprovalState;

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
