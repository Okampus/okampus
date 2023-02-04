import { Field, ObjectType } from '@nestjs/graphql';
import type { ITeam, ITeamMember, ITeamRole, ITeamAction } from '@okampus/shared/dtos';
import { Paginated } from '../../../../shards/types/paginated.type';
import { MembershipModel } from '../../abstract/membership.model';
// eslint-disable-next-line import/no-cycle
import { TeamRoleModel } from '../roles/team-role.model';
// eslint-disable-next-line import/no-cycle
import { TeamActionModel } from './team-action.model';
// eslint-disable-next-line import/no-cycle
import { TeamModel } from './team.model';

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
