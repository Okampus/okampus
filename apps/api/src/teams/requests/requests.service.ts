import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import type { User } from '../../users/user.entity';
import type { MembershipRequestsListOptions } from '../dto/membership-requests-list-options.dto';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
import { MembershipRequestIssuer } from '../types/membership-request-issuer.enum';
import { MembershipRequestState } from '../types/membership-request-state.enum';
import type { CreateTeamMembershipRequestDto } from './dto/create-membership-request-copy.dto';
import type { PutTeamMembershipRequestDto } from './dto/put-membership-request-copy.dto';
import type { UpdateTeamMembershipRequestDto } from './dto/update-membership-request.dto';
import { TeamMembershipRequest } from './team-membership-request.entity';

@Injectable()
export class TeamMembershipRequestsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest)
    private readonly teamMembershipRequestRepository: BaseRepository<TeamMembershipRequest>,
  ) {}

  public async create(
    requester: User,
    teamId: number,
    createTeamMembershipRequestDto: CreateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
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
    const existingRequest = await this.teamMembershipRequestRepository.findOne({
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
      role: createTeamMembershipRequestDto.role,
      meta: createTeamMembershipRequestDto.meta,
    });
    await this.teamMembershipRequestRepository.persistAndFlush(teamMembershipRequest);

    return teamMembershipRequest;
  }

  public async findAll(
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

    return await this.teamMembershipRequestRepository.findWithPagination(
      options,
      { team: { teamId }, ...query },
      { orderBy: { createdAt: 'DESC' }, populate: ['team', 'user', 'issuedBy', 'handledBy'] },
    );
  }

  public async update(
    user: User,
    requestId: number,
    updateTeamMembershipRequestDto: UpdateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    const request = await this.teamMembershipRequestRepository.findOneOrFail(
      { teamMembershipRequestId: requestId },
      { populate: ['team', 'team.members', 'user', 'issuedBy', 'handledBy'] },
    );

    if (request.state !== MembershipRequestState.Pending)
      throw new BadRequestException('Request already handled');

    if (
      (request.issuer === MembershipRequestIssuer.User && request.user.userId !== user.userId)
      || !request.team.canAdminister(user)
    )
      throw new BadRequestException('Not a team admin');

    const handlerMember = await this.teamMemberRepository.findOneOrFail({ user });
    if (request.role === TeamRole.Owner && handlerMember.role !== TeamRole.Owner)
      throw new BadRequestException('Not the owner');

    wrap(request).assign(updateTeamMembershipRequestDto);
    await this.teamMembershipRequestRepository.flush();

    return request;
  }

  public async handleRequest(
    user: User,
    requestId: number,
    updateTeamMembershipRequestDto: PutTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    const request = await this.teamMembershipRequestRepository.findOneOrFail(
      { teamMembershipRequestId: requestId },
      { populate: ['team', 'team.members', 'user', 'issuedBy', 'handledBy'] },
    );

    if (request.state !== MembershipRequestState.Pending)
      throw new BadRequestException('Request already handled');

    // If it was requested by a user, then we have to check that the persone handling it in the team
    // has the permission to do so.
    if (request.issuer === MembershipRequestIssuer.User && !request.team.canAdminister(user))
      throw new BadRequestException('Not a team admin');

    const handlerMember = await this.teamMemberRepository.findOneOrFail({ user });
    if (request.role === TeamRole.Owner && handlerMember.role !== TeamRole.Owner)
      throw new BadRequestException('Not the owner');

    request.handledBy = user;
    request.handledAt = new Date();
    request.handledMessage = updateTeamMembershipRequestDto.handledMessage;
    request.state = updateTeamMembershipRequestDto.state;
    await this.teamMembershipRequestRepository.flush();

    if (updateTeamMembershipRequestDto.state === MembershipRequestState.Approved) {
      if (request.role === TeamRole.Owner)
        handlerMember.role = TeamRole.Coowner;

      const teamMember = new TeamMember({ team: request.team, user: request.user, role: request.role });
      this.teamMemberRepository.persist(teamMember);
      await this.teamMemberRepository.flush();
    }

    return request;
  }
}
