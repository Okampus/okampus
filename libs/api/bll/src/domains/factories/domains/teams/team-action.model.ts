// eslint-disable-next-line import/no-cycle
import { TeamMemberModel } from './team-member.model';
import { TeamModel } from './team.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { TenantEventModel } from '../events/event.model';
import { UserModel } from '../users/user.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ITeam, ITeamAction, ITeamMember, ITenantCore, ITenantEvent, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class TeamActionModel extends TenantScopedModel implements ITeamAction {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;

  @Field(() => Int)
  score!: number;

  @Field(() => TenantEventModel, { nullable: true })
  event?: ITenantEvent;

  @Field(() => TeamModel, { nullable: true })
  team?: ITeam;

  @Field(() => UserModel, { nullable: true })
  user?: IUser;

  @Field(() => TeamMemberModel, { nullable: true })
  teamMember?: ITeamMember;

  constructor(teamAction: ITeamAction) {
    super(teamAction.tenant as ITenantCore);
    this.assign(teamAction);
  }
}

@ObjectType()
export class PaginatedTeamActionModel extends Paginated(TeamActionModel) {}
