import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { TeamRole } from '../shared/lib/types/enums/team-role.enum';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import { User } from '../users/user.entity';
import type { CreateTeamDto } from './dto/create-team.dto';
import type { MembershipRequestsListOptions } from './dto/membership-requests-list-options.dto';
import type { TeamsFilterDto } from './dto/teams-filter.dto';
import type { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import type { UpdateTeamDto } from './dto/update-team.dto';
import { TeamMember } from './entities/team-member.entity';
import { TeamMembershipRequest } from './entities/team-membership-request.entity';
import { Team } from './entities/team.entity';
import { MembershipRequestIssuer } from './membership-request-issuer.enum';
import { MembershipRequestState } from './membership-request-state.enum';
import { TeamSearchService } from './team-search.service';

@Injectable()
export class TeamsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest)
    private readonly teamMembershipRepository: BaseRepository<TeamMembershipRequest>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,

    private readonly teamSearchService: TeamSearchService,
  ) {}

  public async create(user: User, createTeamDto: CreateTeamDto): Promise<Team> {
    const { avatar, ...dto } = createTeamDto;

    const team = new Team(dto);

    if (avatar)
      await this.setAvatar(avatar, team);

    await this.teamRepository.persistAndFlush(team);
    await this.teamSearchService.add(team);

    const member = new TeamMember({ user, team, role: TeamRole.Owner });
    await this.teamMemberRepository.persistAndFlush(member);

    return team;
  }

  public async findAll(
    filters: TeamsFilterDto,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<Team>> {
    let options: FilterQuery<Team> = {};
    if (filters.kind)
      options = { kind: filters.kind };

    return await this.teamRepository.findWithPagination(
      paginationOptions,
      options,
      { orderBy: { name: 'ASC' } },
    );
  }

  public async findOne(teamId: number): Promise<Team> {
    return await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members', 'members.user'] },
    );
  }

  public async findNames(): Promise<Array<Pick<Team, 'avatar' | 'name' | 'teamId'>>> {
    // TODO: Add possibility to filter by kind
    const teams = await this.teamRepository.findAll({ fields: ['name', 'avatar', 'teamId'] });
    // Remove null values for M:N relations that are automatically filled
    return teams.map(({ members, ...keep }) => keep);
  }

  public async update(user: User, teamId: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members'] },
    );

    // TODO: Move this to CASL
    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const { avatar, ...dto } = updateTeamDto;

    if (avatar)
      await this.setAvatar(avatar, team);
    else
      team.avatar = null;

    wrap(team).assign(dto);
    await this.teamRepository.flush();
    await this.teamSearchService.update(team);
    return team;
  }

  public async remove(teamId: number): Promise<void> {
    const team = await this.teamRepository.findOneOrFail({ teamId });
    await this.teamRepository.removeAndFlush(team);
    await this.teamSearchService.remove(team.teamId.toString());
  }

  public async findAllUsersInTeam(
    teamId: number,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.teamMemberRepository.findWithPagination(
      paginationOptions,
      { team: { teamId } },
      { populate: ['user', 'team'], orderBy: { user: { lastname: 'ASC' } } },
    );
  }

  public async updateMember(
    requester: User,
    teamId: number,
    userId: string,
    updateTeamMemberDto: UpdateTeamMemberDto,
  ): Promise<TeamMember> {
    const team = await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members'] },
    );

    const { transferTo, ...updatedPros } = updateTeamMemberDto;

    // TODO: Move this to CASL
    if (!team.canAdminister(requester))
      throw new ForbiddenException('Not a team admin');

    if (typeof updatedPros.role !== 'undefined' && !team.canActOnRole(requester, updatedPros.role))
      throw new ForbiddenException('Role too high');

    const targetTeamMember = await this.teamMemberRepository.findOneOrFail(
      { team: { teamId }, user: { userId } },
      { populate: ['user', 'team'] },
    );

    if (transferTo) {
      if (requester.userId !== targetTeamMember.user.userId)
        throw new BadRequestException('Transfering only allowed when updating self');

      if (targetTeamMember.role !== TeamRole.Owner)
        throw new BadRequestException('Only owners can transfer their role');

      if (transferTo === requester.userId)
        throw new BadRequestException('Cannot transfer to self');

      const transferMemberTarget = await this.teamMemberRepository.findOneOrFail(
        { team: { teamId }, user: { userId: transferTo } },
      );
      transferMemberTarget.role = TeamRole.Owner;
      targetTeamMember.role = TeamRole.Leader;
    }

    wrap(targetTeamMember).assign(updatedPros);
    await this.teamMemberRepository.flush();
    return targetTeamMember;
  }

  public async findTeamMembership(
    userId: string,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.teamMemberRepository.findWithPagination(
      paginationOptions,
      { user: { userId } },
      { populate: ['user', 'team'], orderBy: { team: { name: 'ASC' } } },
    );
  }

  public async inviteUserToTeam(
    requester: User,
    teamId: number,
    invitedUserId: string,
  ): Promise<TeamMembershipRequest> {
    // 1. Check that the given team and user exist, and fetch them.
    const team = await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members'] },
    );
    const invitedUser = await this.userRepository.findOneOrFail({ userId: invitedUserId });

    // 2. Check that the user is not already in the team.
    const existingMember = await this.teamMemberRepository.count({ team, user: invitedUser });
    if (existingMember)
      throw new BadRequestException('User already in team');

    // 3. Check that the user is not already invited to the team (BadRequest),
    // or has requested to join the team (Conflict)
    const existingRequest = await this.teamMembershipRepository.findOne({
      team,
      user: invitedUser,
      state: MembershipRequestState.Pending,
    });
    if (existingRequest) {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (existingRequest.issuer === MembershipRequestIssuer.Team)
        throw new BadRequestException('User already invited');
      else
        throw new ConflictException('Pending user request');
    }

    // 4. Check that the requester is allowed to invite the user.
    // TODO: Move this to CASL
    if (!team.canAdminister(requester))
      throw new ForbiddenException('Not a team admin');

    // 5. Create the request.
    const teamMembershipRequest = new TeamMembershipRequest({
      team,
      user: invitedUser,
      issuedBy: requester,
      issuer: MembershipRequestIssuer.Team,
    });
    await this.teamMembershipRepository.persistAndFlush(teamMembershipRequest);

    return teamMembershipRequest;
  }

  public async requestJoinTeam(requester: User, teamId: number): Promise<TeamMembershipRequest> {
    // 1. Check that the given team exist, and fetch it.
    const team = await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members'] },
    );

    // 2. Check that the user is not already in the team.
    const existing = await this.teamMemberRepository.findOne({ team, user: requester });
    if (existing)
      throw new BadRequestException('User already in team');

    // 3. Check that the user has not already requested to join the team (BadRequest),
    // or has been invited to the team (Conflict)
    const existingRequest = await this.teamMembershipRepository.findOne({
      team,
      user: requester,
      state: MembershipRequestState.Pending,
    });
    if (existingRequest) {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (existingRequest.issuer === MembershipRequestIssuer.User)
        throw new BadRequestException('User already requested');
      else
        throw new ConflictException('Pending user invitation');
    }

    // 4. Create the request.
    const teamMembershipRequest = new TeamMembershipRequest({
      team,
      user: requester,
      issuedBy: requester,
      issuer: MembershipRequestIssuer.User,
    });
    await this.teamMembershipRepository.persistAndFlush(teamMembershipRequest);

    return teamMembershipRequest;
  }

  public async handleRequest(
    user: User,
    teamId: number,
    requestId: number,
    state: MembershipRequestState.Approved | MembershipRequestState.Rejected,
  ): Promise<TeamMembershipRequest> {
    const request = await this.teamMembershipRepository.findOneOrFail(
      { teamMembershipRequestId: requestId },
      { populate: ['team', 'user', 'issuedBy', 'handledBy'] },
    );
    const team = await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members'] },
    );

    // If it was requested by a user, then we have to check that the persone handling it in the team
    // has the permission to do so.
    if (request.issuer === MembershipRequestIssuer.User && !team.canAdminister(user))
      throw new BadRequestException('Not a team admin');

    request.handledBy = user;
    request.handledAt = new Date();
    request.state = state;
    await this.teamMembershipRepository.flush();

    if (state === MembershipRequestState.Approved) {
      const teamMember = new TeamMember({ team, user, role: TeamRole.Member });
      await this.teamMemberRepository.persistAndFlush(teamMember);
    }

    return request;
  }

  public async removeUserFromTeam(requester: User, teamId: number, userId: string): Promise<void> {
    const team = await this.teamRepository.findOneOrFail({ teamId }, { populate: ['members'] });

    const isSelf = requester.userId === userId;

    // TODO: Move this to CASL
    if (!isSelf && !team.canAdminister(requester))
      throw new ForbiddenException('Not a team admin');

    const teamMember = await this.teamMemberRepository.findOneOrFail({ team, user: { userId } });

    if (teamMember.role === TeamRole.Owner)
      throw new ForbiddenException('Cannot remove owner');

    await this.teamMemberRepository.removeAndFlush(teamMember);
  }

  public async findAllMembershipRequestsForTeam(
    teamId: number,
    options?: MembershipRequestsListOptions & Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamMembershipRequest>> {
    let query: FilterQuery<TeamMembershipRequest> = {};

    if (options?.state)
      query = { ...query, state: options.state };
    if (options?.type === 'in')
      query = { ...query, issuer: MembershipRequestIssuer.User };
    else if (options?.type === 'out')
      query = { ...query, issuer: MembershipRequestIssuer.Team };

    return await this.teamMembershipRepository.findWithPagination(
      options,
      { team: { teamId }, ...query },
      { orderBy: { createdAt: 'DESC' }, populate: ['team', 'user', 'issuedBy', 'handledBy'] },
    );
  }

  public async findAllMembershipRequestsForUser(
    userId: string,
    options?: MembershipRequestsListOptions & Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamMembershipRequest>> {
    let query: FilterQuery<TeamMembershipRequest> = {};

    if (options?.state)
      query = { ...query, state: options.state };
    if (options?.type === 'in')
      query = { ...query, issuer: MembershipRequestIssuer.Team };
    else if (options?.type === 'out')
      query = { ...query, issuer: MembershipRequestIssuer.User };

    return await this.teamMembershipRepository.findWithPagination(
      options,
      { user: { userId }, ...query },
      { orderBy: { createdAt: 'DESC' }, populate: ['team', 'user', 'issuedBy', 'handledBy'] },
    );
  }

  private async setAvatar(profileImageId: string, team: Team): Promise<void> {
    // Get the avatar image and validate it
    const avatarImage = await this.profileImageRepository.findOne({ profileImageId }, { populate: ['file'] });
    if (!avatarImage || !avatarImage.isAvailableFor('team', team.teamId))
      throw new BadRequestException('Invalid avatar image');

    // Update the team's avatar
    team.avatar = avatarImage.file.url;

    // Update the target type of the image
    if (!avatarImage.team) {
      avatarImage.team = team;
      await this.profileImageRepository.flush();
    }
  }
}
