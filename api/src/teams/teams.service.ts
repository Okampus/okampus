import type { FilterQuery } from '@mikro-orm/core';
import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { TeamRole } from '../shared/lib/types/enums/team-role.enum';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import { User } from '../users/user.entity';
import type { CreateTeamMemberDto } from './dto/create-team-member.dto';
import type { CreateTeamDto } from './dto/create-team.dto';
import type { TeamsFilterDto } from './dto/teams-filter.dto';
import type { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import type { UpdateTeamDto } from './dto/update-team.dto';
import { TeamMember } from './entities/team-member.entity';
import { Team } from './entities/team.entity';
import { TeamSearchService } from './team-search.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
    private readonly teamSearchService: TeamSearchService,
  ) {}

  public async create(user: User, createTeamDto: CreateTeamDto): Promise<Team> {
    const { avatar, ...dto } = createTeamDto;

    const team = new Team(dto);

    if (avatar)
      await this.setAvatar(avatar, team);

    try {
      await this.teamRepository.persistAndFlush(team);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Team already exists');
      throw error;
    }

    const member = new TeamMember({ user, team, role: TeamRole.Owner });
    await this.teamMemberRepository.persistAndFlush(member);
    await this.teamSearchService.add(team);

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
    const teams = await this.teamRepository.findAll({ fields: ['name', 'avatar', 'teamId'] });
    // Remove null values for M:M relations that are automatically filled
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

  public async findTeamMembership(
    userId: string,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.teamMemberRepository.findWithPagination(
      paginationOptions,
      { user: { userId } },
      { populate: ['user', 'team'], orderBy: { name: 'ASC' } },
    );
  }

  public async addUserToTeam(
    requester: User,
    teamId: number,
    userId: string,
    createTeamMemberDto: CreateTeamMemberDto,
): Promise<TeamMember> {
    const team = await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members'] },
    );

    // TODO: Move this to CASL
    if (!team.canAdminister(requester))
      throw new ForbiddenException('Not a team admin');

    if (createTeamMemberDto.role === TeamRole.Owner)
      throw new BadRequestException('Ownership can only be transferred');

    const user = await this.userRepository.findOneOrFail({ userId });
    const existing = await this.teamMemberRepository.count({ team, user });
    if (existing)
      throw new BadRequestException('User is already in team');

    if (!team.canActOnRole(requester, createTeamMemberDto.role))
      throw new ForbiddenException('Role too high');

    const teamMember = new TeamMember({ ...createTeamMemberDto, team, user });
    await this.teamMemberRepository.persistAndFlush(teamMember);
    return teamMember;
  }

  public async updateUserRole(
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

  public async removeUserFromTeam(requester: User, teamId: number, userId: string): Promise<void> {
    const team = await this.teamRepository.findOneOrFail({ teamId }, { populate: ['members'] });

    const isSelf = requester.userId === userId;

    // TODO: Move this to CASL
    if (!isSelf && !team.canAdminister(requester))
      throw new ForbiddenException('Not a team admin');

    const teamMember = await this.teamMemberRepository.findOneOrFail({ team, user: { userId } });

    if (!isSelf && teamMember.role === TeamRole.Owner)
      throw new ForbiddenException('Cannot remove owner');

    await this.teamMemberRepository.removeAndFlush(teamMember);
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
