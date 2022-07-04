import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { FileUpload } from '../../files/file-uploads/file-upload.entity';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import type { User } from '../../users/user.entity';
import { TeamForm } from '../forms/team-form.entity';
import { TeamMember } from '../members/team-member.entity';
import type { CreateTeamDto } from './dto/create-team.dto';
import type { TeamsFilterDto } from './dto/teams-filter.dto';
import type { UpdateTeamDto } from './dto/update-team.dto';
import { TeamSearchService } from './team-search.service';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,

    private readonly teamSearchService: TeamSearchService,
  ) {}

  public async create(user: User, createTeamDto: CreateTeamDto): Promise<Team> {
    const { avatar, banner, ...dto } = createTeamDto;

    const team = new Team(dto);

    if (avatar)
      await this.setAvatar(avatar, 'avatar', team);

    if (banner)
      await this.setAvatar(banner, 'banner', team);

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

    const memberCountResult: Array<{ team: number; count: string }> = await this.teamMemberRepository
      .createQueryBuilder()
      .count('teamMemberId')
      .select(['team', 'count'])
      .groupBy('team')
      .execute();
    const allMemberCounts = new Map(memberCountResult.map(entry => [entry.team, entry.count]));

    const boardRoles = [TeamRole.Owner, TeamRole.Treasurer, TeamRole.Secretary];
    const teamBoardMembers = await this.teamMemberRepository.find(
      { role: { $in: boardRoles } },
      { populate: ['team', 'user'] },
    );

    const allTeams = await this.teamRepository.findWithPagination(
      paginationOptions,
      options,
      { orderBy: { name: 'ASC' } },
    );

    allTeams.items = allTeams.items.map((team) => {
      // TODO: Maybe find a better way to add this property? Something virtual? computed on-the-fly? added elsewhere?
      // @ts-expect-error: We add a new property to the object, but it's fine.
      team.memberCount = Number(allMemberCounts.get(team.teamId) ?? 0);

      const predicate = (role: TeamRole) =>
        (member: TeamMember) => member.team.teamId === team.teamId && member.role === role;
      // @ts-expect-error: We add a new property to the object, but it's fine.
      team.owner = teamBoardMembers.find(predicate(TeamRole.Owner))?.user ?? null;
      // @ts-expect-error: We add a new property to the object, but it's fine.
      team.treasurer = teamBoardMembers.find(predicate(TeamRole.Treasurer))?.user ?? null;
      // @ts-expect-error: We add a new property to the object, but it's fine.
      team.secretary = teamBoardMembers.find(predicate(TeamRole.Secretary))?.user ?? null;

      return team;
    });
    return allTeams;
  }

  public async findOne(teamId: number): Promise<Team> {
    return await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members', 'members.user', 'membershipRequestForm', 'membershipRequestForm.createdBy'] },
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

    const {
      avatar,
      banner,
      membershipRequestFormId: teamFormId,
      ...dto
    } = updateTeamDto;

    if (typeof avatar !== 'undefined') {
      if (avatar)
        await this.setAvatar(avatar, 'avatar', team);
      else
        team.avatar = null;
    }

    if (typeof banner !== 'undefined') {
      if (banner)
        await this.setAvatar(banner, 'banner', team);
      else
        team.banner = null;
    }

    // Check that the provided form id is valid, is a template, and is not already used
    if (typeof teamFormId !== 'undefined') {
      if (teamFormId) {
        const form = await this.teamFormRepository.findOneOrFail({ teamFormId, team });
        if (form.isTemplate)
          throw new BadRequestException('Form is a template');
        team.membershipRequestForm = form;
      } else {
        team.membershipRequestForm = null;
      }
    }

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

  public async updateProfileImage(user: User, teamId: number, type: 'avatar' | 'banner', profileImage: ProfileImage): Promise<Team> {
    const team = await this.teamRepository.findOneOrFail(
      { teamId },
      { populate: ['members'] },
    );

    // TODO: Move this to CASL
    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.setAvatar(profileImage, type, team);

    await this.profileImageRepository.flush();
    await this.teamRepository.flush();
    return team;
  }

  private async setAvatar(profileImage: ProfileImage | string, type: 'avatar' | 'banner', team: Team): Promise<void> {
    // Get the avatar image and validate it
    const profileImageId = typeof profileImage === 'string' ? profileImage : profileImage.profileImageId;
    const avatarImage = profileImage instanceof ProfileImage && profileImage.file instanceof FileUpload
      ? profileImage
      : await this.profileImageRepository.findOne({ profileImageId }, { populate: ['file'] });

    if (!avatarImage || !avatarImage.isAvailableFor('team', team.teamId))
      throw new BadRequestException(`Invalid ${type} image`);

    // Update the team's image
    team[type] = avatarImage.file.url;

    // Update the target type of the image
    if (!avatarImage.team) {
      avatarImage.team = team;
      await this.profileImageRepository.flush();
    }
  }
}
