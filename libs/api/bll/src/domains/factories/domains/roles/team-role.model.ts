/* eslint-disable import/no-cycle */
import { RoleModel } from '../../index';
import { TeamModel } from '../../index';

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
