import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { Team } from '../teams/team.entity';
import { MembershipRequestIssuer } from '../types/membership-request-issuer.enum';
import { MembershipRequestState } from '../types/membership-request-state.enum';
import type { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMember } from './team-member.entity';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest)
    private readonly teamMembershipRequestRepository: BaseRepository<TeamMembershipRequest>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async inviteUser(
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
    const existingRequest = await this.teamMembershipRequestRepository.findOne({
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
    await this.teamMembershipRequestRepository.persistAndFlush(teamMembershipRequest);

    return teamMembershipRequest;
  }

  public async findAllMembers(
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

  public async removeMember(requester: User, teamId: number, userId: string): Promise<void> {
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
}
