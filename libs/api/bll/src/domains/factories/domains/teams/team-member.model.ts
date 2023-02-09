// eslint-disable-next-line import/no-cycle
import { TeamActionModel } from './team-action.model';
// eslint-disable-next-line import/no-cycle
import { TeamModel } from './team.model';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { MembershipModel } from '../../abstract/membership.model';
import { TeamRoleModel } from '../roles/team-role.model';
import { Field, ObjectType } from '@nestjs/graphql';
import type { ITeam, ITeamMember, ITeamRole, ITeamAction } from '@okampus/shared/dtos';

@ObjectType()
export class TeamMemberModel extends MembershipModel implements ITeamMember {
  @Field(() => TeamModel, { nullable: true })
  team?: ITeam;

  @Field(() => [TeamRoleModel])
  roles?: ITeamRole[];

  @Field(() => [TeamActionModel])
  activities!: ITeamAction[];

  constructor(membership: ITeamMember) {
    super(membership);
    this.assign(membership);
  }
}

@ObjectType()
export class PaginatedTeamMemberModel extends Paginated(TeamMemberModel) {}
