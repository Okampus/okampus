import { TagModel } from './tag.model';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { TeamModel } from '../teams/team.model';
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
