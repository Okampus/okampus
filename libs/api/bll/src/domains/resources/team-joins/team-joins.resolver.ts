// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamJoinsService } from './team-joins.service';

import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { TeamJoinModel, PaginatedTeamJoinModel } from '../../factories';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateTeamJoinDto, UpdateTeamJoinDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';

@Resolver(() => TeamJoinModel)
export class TeamJoinsResolver {
  constructor(private readonly teamJoinsService: TeamJoinsService) {}

  @Query(() => TeamJoinModel)
  teamJoinById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.teamJoinsService.findOneById(id);
  }

  @Query(() => PaginatedTeamJoinModel)
  teamJoins(@Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions) {
    return this.teamJoinsService.find(options);
  }

  @Mutation(() => TeamJoinModel)
  createTeamJoin(@Args('teamJoin', { type: () => CreateTeamJoinDto }) teamJoin: CreateTeamJoinDto) {
    return this.teamJoinsService.create(teamJoin);
  }

  @Mutation(() => TeamJoinModel)
  updateTeamJoin(@Args('updateTeamJoin', { type: () => UpdateTeamJoinDto }) updateTeamJoin: UpdateTeamJoinDto) {
    return this.teamJoinsService.update(updateTeamJoin);
  }

  @Mutation(() => Boolean)
  deleteTeamJoin(@Args('id', { type: () => String }) id: Snowflake) {
    return this.teamJoinsService.delete(id);
  }
}
