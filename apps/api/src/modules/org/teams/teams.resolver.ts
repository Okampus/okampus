import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { PubSubEngine } from 'graphql-subscriptions';
import { GraphQLUpload } from 'graphql-upload-minimal';
import groupBy from 'lodash.groupby';
import mapValues from 'lodash.mapvalues';
import { PaginationOptions } from '@common/modules/pagination';
import { APP_PUB_SUB } from '@lib/constants';
import { CurrentTenant } from '@lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { BaseRepository } from '@lib/orm/base.repository';
import { FileKind } from '@lib/types/enums/file-kind.enum';
import { MembershipRequestState } from '@lib/types/enums/membership-request-state.enum';
import { SubscriptionType } from '@lib/types/enums/subscription-type.enum';
import { TeamKind } from '@lib/types/enums/team-kind.enum';
import { TeamRole } from '@lib/types/enums/team-role.enum';
import { TeamMembershipStatus } from '@lib/types/models/team-membership-status.model';
import { CreateTeamDto } from '@teams/dto/create-team.dto';
import { TeamFormsService } from '@teams/forms/forms.service';
import { PaginatedTeamForm } from '@teams/forms/team-form.entity';
import { Tenant } from '@tenants/tenant.entity';
import { User } from '@uaa/users/user.entity';
import { FileUploadsService } from '@upload/file-uploads/file-uploads.service';
import { CreateTeamFileDto } from '@upload/team-files/dto/create-team-file.dto';
import { PaginatedTeamFile } from '@upload/team-files/team-file.entity';
import { TeamFilesService } from '@upload/team-files/team-files.service';
import { TeamGallery } from '@upload/team-galleries/team-gallery.entity';
import { TeamsFilterDto } from './dto/teams-filter.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Interest } from './interests/interest.entity';
import { InterestsService } from './interests/interests.service';
import { TeamMember } from './members/team-member.entity';
import { PaginatedTeam, Team } from './team.entity';
import { TeamsService } from './teams.service';

export interface ContextBatchTeams {
  userInterests: Record<number, Interest | null>;
  userMemberships: Record<number, TeamMember | null>;
  galleries: Record<number, TeamGallery[]>;
  pendingRequests: Record<number, boolean>;
  boardMembers: Record<number, TeamMember[]>;
  isBatched: boolean;
}

@Resolver(() => Team)
export class TeamsResolver {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamGallery) private readonly teamGalleryRepository: BaseRepository<TeamGallery>,
    private readonly teamsService: TeamsService,
    private readonly interestsService: InterestsService,
    private readonly teamFilesService: TeamFilesService,
    private readonly teamFormsService: TeamFormsService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Team, { nullable: true })
  public async teamById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Team> {
    return await this.teamsService.findOne(id);
  }

  @Query(() => Team, { nullable: true })
  public async clubById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Team> {
    return await this.teamsService.findOne(id, { kind: TeamKind.Club });
  }

  @Query(() => PaginatedTeam)
  public async teams(
    @Args('query', { nullable: true }) paginationArgs: PaginationOptions,
    @Args('filters', { nullable: true }) filters?: TeamsFilterDto,
  ): Promise<PaginatedTeam> {
    return await this.teamsService.findAll(filters ?? {}, paginationArgs ?? {});
  }

  @Query(() => PaginatedTeam)
  public async clubs(@CurrentUser() user: User, @Context() teamContext: ContextBatchTeams): Promise<PaginatedTeam> {
    await this.userRepository.populate(user, ['teamMembershipRequests', 'teamMemberships']);

    teamContext.boardMembers = groupBy(await this.teamMemberRepository.find(
      { role: { $in: [TeamRole.Owner, TeamRole.Coowner, TeamRole.Treasurer, TeamRole.Secretary, TeamRole.Manager] } },
      { populate: ['team', 'user'] },
    ), 'team.id');

    teamContext.galleries = groupBy(await this.teamGalleryRepository.find(
      { event: null, active: true },
      { populate: ['file'] },
    ), 'team.id');

    const memberships = await user.teamMemberships.loadItems();
    teamContext.userMemberships = Object.fromEntries(memberships.map(membership => [membership.team.id, membership]));
    const interests = await user.interests.loadItems();
    teamContext.userInterests = Object.fromEntries(interests.map(interest => [interest.team.id, interest]));
    teamContext.pendingRequests = mapValues(
      groupBy(await user.teamMembershipRequests.loadItems(), 'team.id'),
      requests => requests.some(r => r.state === MembershipRequestState.Pending),
    );

    teamContext.isBatched = true;

    return await this.teamsService.findAll({ kind: TeamKind.Club });
  }

  @ResolveField(() => [TeamMember])
  public async boardMembers(
    @Parent() team: Team,
    @Context() batchContext: ContextBatchTeams,
  ): Promise<TeamMember[]> {
    if (batchContext?.isBatched)
      return batchContext?.boardMembers?.[team.id] ?? [];

    const boardRoles = [TeamRole.Owner, TeamRole.Coowner, TeamRole.Treasurer, TeamRole.Secretary, TeamRole.Manager];
    const teamBoardMembers = await this.teamMemberRepository.find(
      { role: { $in: boardRoles }, team: { id: team.id } },
      { populate: ['user'] },
    );

    return teamBoardMembers;
  }

  @ResolveField(() => [TeamMember])
  public async activeMembers(@Parent() team: Team): Promise<TeamMember[]> {
    await this.teamRepository.populate(team, ['members', 'members.user']);
    const memberships = await team.members.loadItems();
    return memberships.filter(membership => membership.active);
  }

  @ResolveField(() => PaginatedTeamFile)
  public async teamFiles(@Parent() team: Team): Promise<PaginatedTeamFile> {
    return await this.teamFilesService.findAll({
      id: team.id, active: true, limit: 100, offset: 0,
    });
  }

  @ResolveField(() => [TeamGallery])
  public async mainGalleries(
    @Parent() team: Team,
    @Context() batchContext: ContextBatchTeams,
  ): Promise<TeamGallery[]> {
    if (batchContext?.isBatched)
      return batchContext?.galleries?.[team.id] ?? [];

    return await this.teamGalleryRepository.find(
      { active: true, team: { id: team.id }, event: null },
      { populate: ['file'] },
    );
  }

  @Mutation(() => Team)
  public async addTeamFile(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Args('file', { type: () => GraphQLUpload }) file: MulterFile,
    @Args('createFile') createFile: CreateTeamFileDto,
  ): Promise<Team> {
    const fileUpload = await this.fileUploadsService.create(
      tenant,
      user,
      file,
      FileKind.TeamFile,
      createFile.fileLastModifiedAt,
    );
    await this.teamFilesService.create(user, createFile, fileUpload);
    return await this.teamsService.findOne(createFile.teamId);
  }

  @Mutation(() => Team)
  public async deleteTeamFile(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Args('id') id: string,
  ): Promise<Team> {
    const file = await this.teamFilesService.findOne(id);
    await this.teamFilesService.remove(user, id);
    return await this.teamsService.findOne(file.team.id);
  }

  @ResolveField(() => PaginatedTeamForm)
  public async forms(@Parent() team: Team): Promise<PaginatedTeamForm> {
    return await this.teamFormsService.findAll({ id: team.id, isTemplate: false });
  }

  @ResolveField(() => PaginatedTeamForm)
  public async formTemplates(@Parent() team: Team): Promise<PaginatedTeamForm> {
    return await this.teamFormsService.findAll({ id: team.id, isTemplate: true });
  }

  @ResolveField(() => Interest, { nullable: true })
  public async userInterest(
    @CurrentUser() user: User,
    @Parent() team: Team,
    @Context() batchContext: ContextBatchTeams,
): Promise<Interest | null> {
    if (batchContext?.isBatched)
      return batchContext?.userInterests?.[team.id] ?? null;

    return await this.interestsService.findForUserTeam(user.id, team.id);
  }

  @ResolveField(() => TeamMembershipStatus, { nullable: true })
  public async userMembership(
    @CurrentUser() user: User,
    @Parent() team: Team,
    @Context() batchContext: ContextBatchTeams,
  ): Promise<TeamMembershipStatus> {
    if (batchContext?.isBatched) {
      return {
        membership: batchContext?.userMemberships?.[team.id] ?? null,
        pendingRequest: batchContext?.pendingRequests?.[team.id] ?? false,
      };
    }

    const memberships = await user.teamMemberships.loadItems();
    const requests = await user.teamMembershipRequests.loadItems();

    return {
      membership: memberships.find(m => m.team.id === team.id) ?? null,
      pendingRequest: requests.some(r => r.state === MembershipRequestState.Pending && r.team.id === team.id),
    };
  }

  @ResolveField(() => [Interest], { nullable: true })
  public async interest(@Parent() team: Team): Promise<Interest[]> {
    return await this.interestsService.findAllByTeam(team.id);
  }

  @Mutation(() => Team)
  public async addTeam(
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
    @Args('team') team: CreateTeamDto,
  ): Promise<Team> {
    const createdTeam = await this.teamsService.create(tenant, user, team);
    await this.pubSub.publish(SubscriptionType.TeamAdded, { teamAdded: createdTeam });
    return createdTeam;
  }

  @Mutation(() => Team)
  public async updateTeam(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('team') team: UpdateTeamDto,
  ): Promise<Team> {
    const updatedTeam = await this.teamsService.update(id, team);
    await this.pubSub.publish(SubscriptionType.TeamUpdated, { teamUpdated: updatedTeam });
    return updatedTeam;
  }

  @Subscription(() => Team)
  public teamAdded(): AsyncIterator<Team> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamAdded);
  }

  @Subscription(() => Team)
  public teamUpdated(): AsyncIterator<Team> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamUpdated);
  }
}
