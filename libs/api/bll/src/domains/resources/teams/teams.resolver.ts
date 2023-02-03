import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { TeamsService } from './teams.service';
import { CreateOrgDocumentDto, CreateTeamDto, UpdateTeamDto } from '@okampus/shared/dtos';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { MulterFileType, Snowflake } from '@okampus/shared/types';
import { TeamModel, PaginatedTeamModel } from '../../factories/domains/teams/team.model';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { ActorImageType } from '@okampus/shared/enums';
import { OrgDocumentModel } from '../../factories/domains/documents/org-document.model';

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
  teams(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.teamsService.find(options);
  }

  @Mutation(() => TeamModel)
  createTeam(
    @Args('team') team: CreateTeamDto,
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
    @Args('teamId') teamId: string,
    @Args('createOrgDocument') createOrgDocument: CreateOrgDocumentDto,
    @Args('documentFile', { type: () => GraphQLUpload }) documentFile: MulterFileType
  ): Promise<OrgDocumentModel> {
    return this.teamsService.teamAddDocument(teamId, createOrgDocument, documentFile);
  }

  @Mutation(() => TeamModel)
  updateTeam(@Args('updateTeam') updateTeam: UpdateTeamDto) {
    return this.teamsService.update(updateTeam);
  }

  @Mutation(() => Boolean)
  deleteTeam(@Args('id', { type: () => String }) id: Snowflake) {
    return this.teamsService.delete(id);
  }
}
