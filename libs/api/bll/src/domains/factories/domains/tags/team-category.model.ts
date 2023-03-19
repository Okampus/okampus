/* eslint-disable import/no-cycle */
import { TagModel } from '../../index';
import { TeamModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, ObjectType } from '@nestjs/graphql';
import { TagKind } from '@okampus/shared/enums';
import type { ITeam, ITeamCategory } from '@okampus/shared/dtos';

@ObjectType()
export class TeamCategoryModel extends TagModel implements ITeamCategory {
  @Field(() => [TeamModel])
  teams!: ITeam[];

  constructor(teamCategory: ITeamCategory) {
    super({ ...teamCategory, tagKind: TagKind.TeamCategory });
    this.assign(teamCategory);
  }
}

@ObjectType()
export class PaginatedTeamCategoryModel extends Paginated(TeamCategoryModel) {}
