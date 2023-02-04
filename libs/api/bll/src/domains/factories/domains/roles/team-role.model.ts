import { RoleModel } from './role.model';
// eslint-disable-next-line import/no-cycle
import { TeamModel } from '../teams/team.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { TeamPermissions, TeamRoleCategory } from '@okampus/shared/enums';
import type { ITeam, ITeamRole } from '@okampus/shared/dtos';

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
