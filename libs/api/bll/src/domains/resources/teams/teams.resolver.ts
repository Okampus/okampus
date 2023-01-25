import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto } from '@okampus/shared/dtos';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { UUID } from '@okampus/shared/types';
import { TeamModel, PaginatedTeamModel } from '../../factories/teams/team.model';

@Resolver(() => TeamModel)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => TeamModel)
  teamById(@Args('id', { type: () => String }) id: UUID) {
    return this.teamsService.findOneById(id);
  }

  @Query(() => TeamModel)
  teamBySlug(@Args('slug') slug: string) {
    return this.teamsService.findOneBySlug(slug);
  }

  @Query(() => PaginatedTeamModel)
  teams(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.teamsService.find(options);
  }

  @Mutation(() => TeamModel)
  createTeam(@Args('team') team: CreateTeamDto) {
    return this.teamsService.create(team);
  }

  @Mutation(() => TeamModel)
  updateTeam(@Args('updateTeam') updateTeam: UpdateTeamDto) {
    return this.teamsService.update(updateTeam);
  }

  @Mutation(() => Boolean)
  deleteTeam(@Args('id', { type: () => String }) id: UUID) {
    return this.teamsService.delete(id);
  }
}
