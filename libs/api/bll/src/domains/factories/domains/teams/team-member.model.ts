// eslint-disable-next-line import/no-cycle
import { TeamActionModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { TeamModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { MembershipModel } from '../../index';
import { TeamRoleModel } from '../../index';
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
