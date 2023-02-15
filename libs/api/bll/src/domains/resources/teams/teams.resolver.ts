// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamsService } from './teams.service';

import { TeamFilterOptions } from './team-filter-options.type';
import { TeamModel, PaginatedTeamModel } from '../../factories/domains/teams/team.model';
import { OrgDocumentModel } from '../../factories/domains/documents/org-document.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { ActorImageType } from '@okampus/shared/enums';
import { CreateTeamDto, UpdateTeamDto } from '@okampus/shared/dtos';
import { CreateOrgDocumentDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';

@Resolver(() => TeamModel)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => TeamModel)
  teamById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.teamsService.findOneById(id);
  }

  @Query(() => TeamModel)
  teamBySlug(@Args('slug') slug: string) {
    return this.teamsService.findOneBySlug(slug);
  }

  @Query(() => PaginatedTeamModel)
  teams(
    @Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions,
    @Args('filter', { type: () => TeamFilterOptions, nullable: true }) filter: TeamFilterOptions
  ) {
    // eslint-disable-next-line unicorn/no-array-method-this-argument
    return this.teamsService.find(options, filter);
  }

  @Mutation(() => TeamModel)
  createTeam(
    @Args('team', { type: () => CreateTeamDto }) team: CreateTeamDto,
    @Args('avatar', { type: () => GraphQLUpload, nullable: true }) avatar?: MulterFileType,
    @Args('avatarDark', { type: () => GraphQLUpload, nullable: true }) avatarDark?: MulterFileType,
    @Args('banner', { type: () => GraphQLUpload, nullable: true }) banner?: MulterFileType
  ) {
    return this.teamsService.create(team, {
      [ActorImageType.Avatar]: avatar,
      [ActorImageType.AvatarDarkMode]: avatarDark,
      [ActorImageType.Banner]: banner,
    });
  }

  @Mutation(() => OrgDocumentModel)
  teamAddDocument(
    @Args('teamId', { type: () => String }) teamId: Snowflake,
    @Args('createOrgDocument', { type: () => CreateOrgDocumentDto }) createOrgDocument: CreateOrgDocumentDto,
    @Args('documentFile', { type: () => GraphQLUpload }) documentFile: MulterFileType
  ): Promise<OrgDocumentModel> {
    return this.teamsService.teamAddDocument(teamId, createOrgDocument, documentFile);
  }

  @Mutation(() => TeamModel)
  updateTeam(@Args('updateTeam', { type: () => UpdateTeamDto }) updateTeam: UpdateTeamDto) {
    return this.teamsService.update(updateTeam);
  }

  @Mutation(() => Boolean)
  deleteTeam(@Args('id', { type: () => String }) id: Snowflake) {
    return this.teamsService.delete(id);
  }
}
