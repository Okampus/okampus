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
import { Express } from 'express';
import { PubSubEngine } from 'graphql-subscriptions';
import { GraphQLUpload } from 'graphql-upload-minimal';
import groupBy from 'lodash.groupby';
import mapValues from 'lodash.mapvalues';
import { FileUploadsService } from '../../files/file-uploads/file-uploads.service';
import { CreateTeamFileDto } from '../../files/team-files/dto/create-team-file.dto';
import { TeamFile } from '../../files/team-files/team-file.entity';
import { TeamFilesService } from '../../files/team-files/team-files.service';
import { APP_PUB_SUB } from '../../shared/lib/constants';
import { CurrentTenant } from '../../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { SubscriptionType } from '../../shared/lib/types/enums/subscription-type.enum';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import { Tenant } from '../../tenants/tenants/tenant.entity';
import { User } from '../../users/user.entity';
import { TeamFormsService } from '../forms/forms.service';
import { TeamForm } from '../forms/team-form.entity';
import { Interest } from '../interests/interest.entity';
import { InterestsService } from '../interests/interests.service';
import { TeamMember } from '../members/team-member.entity';
import { MembershipRequestState } from '../types/membership-request-state.enum';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsFilterDto } from './dto/teams-filter.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamMembershipStatus } from './team-membership-status.model';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';

export interface ContextBatchTeams {
  memberships: Record<number, TeamMember | null>;
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
    private readonly interestsService: InterestsService,
    private readonly teamsService: TeamsService,
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

  @Query(() => [Team])
  public async teams(
    @Args('filters', { nullable: true }) filters?: TeamsFilterDto,
  ): Promise<Team[]> {
    const paginatedTeams = await this.teamsService.findAll(filters ?? {});
    return paginatedTeams.items;
  }

  @Query(() => [Team])
  public async clubs(@CurrentUser() user: User, @Context() teamContext: ContextBatchTeams): Promise<Team[]> {
    await this.userRepository.populate(user, ['teamMembershipRequests', 'teamMemberships']);

    teamContext.boardMembers = groupBy(await this.teamMemberRepository.find(
      { role: { $in: [TeamRole.Owner, TeamRole.Coowner, TeamRole.Treasurer, TeamRole.Secretary, TeamRole.Manager] } },
      { populate: ['team', 'user'] },
    ), 'team.id');

    const memberships = await user.teamMemberships.loadItems();
    teamContext.memberships = Object.fromEntries(memberships.map(membership => [membership.team.id, membership]));
    teamContext.pendingRequests = mapValues(
      groupBy(await user.teamMembershipRequests.loadItems(), 'team.id'),
      requests => requests.some(r => r.state === MembershipRequestState.Pending),
    );

    teamContext.isBatched = true;

    const paginatedTeams = await this.teamsService.findAll({ kind: TeamKind.Club });
    return paginatedTeams.items;
  }

  @ResolveField(() => [TeamMember])
  public async boardMembers(
    @Parent() team: Team,
    @Context() membershipContext: ContextBatchTeams,
  ): Promise<TeamMember[]> {
    if (membershipContext?.isBatched)
      return membershipContext?.boardMembers?.[team.id] ?? [];

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

  @ResolveField(() => [TeamFile])
  public async teamFiles(@Parent() team: Team): Promise<TeamFile[]> {
    const paginatedFiles = await this.teamFilesService.findAll({
      id: team.id, active: true, page: 1, itemsPerPage: 100,
    });
    return paginatedFiles.items;
  }

  @Mutation(() => Team)
  public async addTeamFile(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Args('file', { type: () => GraphQLUpload }) file: Express.Multer.File,
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

  @ResolveField(() => [TeamForm])
  public async forms(@Parent() team: Team): Promise<TeamForm[]> {
    const paginatedForms = await this.teamFormsService.findAll({ id: team.id, isTemplate: false });
    return paginatedForms.items;
  }

  @ResolveField(() => [TeamForm])
  public async formTemplates(@Parent() team: Team): Promise<TeamForm[]> {
    const paginatedFormTemplates = await this.teamFormsService.findAll({ id: team.id, isTemplate: true });
    return paginatedFormTemplates.items;
  }

  @ResolveField(() => TeamMembershipStatus, { nullable: true })
  public async userMembership(
    @CurrentUser() user: User,
    @Parent() team: Team,
    @Context() membershipContext: ContextBatchTeams,
  ): Promise<TeamMembershipStatus> {
    if (membershipContext?.isBatched) {
      return {
        membership: membershipContext?.memberships?.[team.id] ?? null,
        pendingRequest: membershipContext?.pendingRequests?.[team.id] ?? false,
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
    const updatedTeam = await this.teamsService.update(user, id, team);
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
