import { Field, ObjectType } from '@nestjs/graphql';
import type { ITeam, ITeamRole } from '@okampus/shared/dtos';
import { TeamPermissions, TeamRoleCategory } from '@okampus/shared/enums';
// eslint-disable-next-line import/no-cycle
import { TeamModel } from '../teams/team.model';
import { RoleModel } from './role.model';

@ObjectType()
export class TeamRoleModel extends RoleModel implements ITeamRole {
  @Field(() => TeamModel)
  team?: ITeam;

  @Field(() => [TeamPermissions])
  permissions: TeamPermissions[] = [];

  @Field(() => TeamRoleCategory)
  category!: TeamRoleCategory;

  constructor(role: ITeamRole) {
    super(role);
    this.assign(role);
  }
}
