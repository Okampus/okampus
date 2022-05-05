import type { FilterQuery } from '@mikro-orm/core';
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
import { TeamMembershipRequest } from './team-membership-request.entity';

@Injectable()
export class TeamMembershipRequestsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest)
    private readonly teamMembershipRequestRepository: BaseRepository<TeamMembershipRequest>,
  ) {}

  public async create(requester: User, teamId: number): Promise<TeamMembershipRequest> {
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

  public async handleRequest(
    user: User,
    requestId: number,
    state: MembershipRequestState.Approved | MembershipRequestState.Rejected,
  ): Promise<TeamMembershipRequest> {
    const request = await this.teamMembershipRequestRepository.findOneOrFail(
      { teamMembershipRequestId: requestId },
      { populate: ['team', 'user', 'issuedBy', 'handledBy'] },
    );

    if (request.state !== MembershipRequestState.Pending)
      throw new BadRequestException('Request already handled');

    // If it was requested by a user, then we have to check that the persone handling it in the team
    // has the permission to do so.
    if (request.issuer === MembershipRequestIssuer.User && !request.team.canAdminister(user))
      throw new BadRequestException('Not a team admin');

    request.handledBy = user;
    request.handledAt = new Date();
    request.state = state;
    await this.teamMembershipRequestRepository.flush();

    if (state === MembershipRequestState.Approved) {
      const teamMember = new TeamMember({ team: request.team, user: request.user, role: TeamRole.Member });
      await this.teamMemberRepository.persistAndFlush(teamMember);
    }

    return request;
  }
}
