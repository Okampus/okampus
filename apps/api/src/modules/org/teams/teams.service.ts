import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { LabelType } from '@common/lib/types/enums/label-type.enum';
import { TeamRole } from '@common/lib/types/enums/team-role.enum';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { Label } from '@modules/catalog/labels/label.entity';
import type { CreateTeamDto } from '@modules/org/teams/dto/create-team.dto';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import type { CreateSocialDto } from '@modules/org/teams/socials/dto/create-social.dto';
import { FileUpload } from '@modules/store/file-uploads/file-upload.entity';
import { ProfileImage } from '@modules/store/profile-images/profile-image.entity';
import type { User } from '@modules/uua/users/user.entity';
import type { Tenant } from '../tenants/tenant.entity';
import type { TeamsFilterDto } from './dto/teams-filter.dto';
import type { UpdateTeamDto } from './dto/update-team.dto';
import { TeamMember } from './members/team-member.entity';
import { Social } from './socials/social.entity';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(Label)
    private readonly teamLabelRepository: BaseRepository<Label>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamForm)
    private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(Social)
    private readonly socialsRepository: BaseRepository<Social>,
    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: BaseRepository<ProfileImage>,
  ) {}

  public async create(
    tenant: Tenant,
    user: User,
    createTeamDto: CreateTeamDto,
  ): Promise<Team> {
    const {
 avatar, banner, labels, ...dto
} = createTeamDto;

    const team = new Team({ ...dto, tenant });

    const existingLabels = await this.teamLabelRepository.find({
      name: { $in: labels },
    });
    const newLabels: Label[] = labels
        ?.filter(tag => !existingLabels.some(t => t.name === tag))
        ?.map(name => new Label({ name, type: LabelType.Meta })) ?? [];

    if (newLabels.length > 0) {
      await this.teamLabelRepository.persistAndFlush(newLabels);
      team.labels.add(...newLabels);
    }
    team.labels.add(...existingLabels);

    if (avatar)
await this.setImage(avatar, 'avatar', team);

    if (banner)
await this.setImage(banner, 'banner', team);

    await this.teamRepository.persistAndFlush(team);

    const member = new TeamMember({ user, team, role: TeamRole.Owner });
    await this.teamMemberRepository.persistAndFlush(member);

    return team;
  }

  public async findAll(
    filters?: TeamsFilterDto,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<Team>> {
    let options: FilterQuery<Team> = {};
    if (filters?.kind)
options = { kind: filters.kind };

    const allTeams = await this.teamRepository.findWithPagination(
      paginationOptions,
      options,
      {
        orderBy: { name: 'ASC' },
        populate: ['membershipRequestForm', 'labels', 'socials'],
      },
    );

    return allTeams;
  }

  public async findOne(id: number, filters?: TeamsFilterDto): Promise<Team> {
    let options: FilterQuery<Team> = {};
    if (filters?.kind)
options = { kind: filters.kind };

    const team = await this.teamRepository.findOneOrFail(
      { id, ...options },
      {
        populate: [
          'members',
          'members.user',
          'membershipRequestForm',
          'membershipRequestForm.createdBy',
          'labels',
          'socials',
        ],
      },
    );

    return team;
  }

  public async findNames(): Promise<
    Array<Pick<Team, 'avatar' | 'id' | 'name'>>
  > {
    // TODO: Add possibility to filter by kind
    const teams = await this.teamRepository.findAll({
      fields: ['name', 'avatar', 'id'],
    });
    // Remove null values for M:N relations that are automatically filled
    return teams.map(({ members, ...keep }) => keep);
  }

  public async update(
    user: User,
    id: number,
    updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    const team = await this.teamRepository.findOneOrFail(
      { id },
      { populate: ['members', 'membershipRequestForm'] },
    );

    // TODO: Move this to CASL
    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const {
      avatar,
      banner,
      membershipRequestFormId,
      labels: wantedLabels,
      ...dto
    } = updateTeamDto;

    if (wantedLabels) {
      if (wantedLabels.length === 0) {
        team.labels.removeAll();
      } else {
        const labels = await this.teamLabelRepository.find({
          name: { $in: wantedLabels },
        });
        team.labels.set(labels);
      }
    }

    if (typeof avatar !== 'undefined') {
      if (avatar)
await this.setImage(avatar, 'avatar', team);
      else
team.avatar = null;
    }

    if (typeof banner !== 'undefined') {
      if (banner)
await this.setImage(banner, 'banner', team);
      else
team.banner = null;
    }

    // Check that the provided form id is valid, is a template, and is not already used
    if (typeof membershipRequestFormId !== 'undefined') {
      if (membershipRequestFormId) {
        const form = await this.teamFormRepository.findOneOrFail({
          id: membershipRequestFormId,
          team,
        });
        if (form.isTemplate)
          throw new BadRequestException('Form is a template');
        team.membershipRequestForm = form;
      } else {
        team.membershipRequestForm = null;
      }
    }

    wrap(team).assign(dto);
    await this.teamRepository.flush();
    return team;
  }

  public async remove(id: number): Promise<void> {
    const team = await this.teamRepository.findOneOrFail({ id });
    await this.teamRepository.removeAndFlush(team);
  }

  public async addSocialAccount(
    user: User,
    id: number,
    createSocialDto: CreateSocialDto,
  ): Promise<Social> {
    const team = await this.teamRepository.findOneOrFail({ id });

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const social = new Social({ ...createSocialDto, team });
    await this.socialsRepository.persistAndFlush(social);
    return social;
  }

  public async updateProfileImage(
    user: User,
    id: number,
    type: 'avatar' | 'banner',
    profileImage: ProfileImage,
  ): Promise<Team> {
    const team = await this.teamRepository.findOneOrFail(
      { id },
      { populate: ['members'] },
    );

    // TODO: Move this to CASL
    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.setImage(profileImage, type, team);

    await this.profileImageRepository.flush();
    await this.teamRepository.flush();
    return team;
  }

  private async setImage(
    profileImage: ProfileImage | string,
    type: 'avatar' | 'banner',
    team: Team,
  ): Promise<void> {
    // Get the avatar image and validate it
    const id = typeof profileImage === 'string' ? profileImage : profileImage.id;
    const avatarImage = profileImage instanceof ProfileImage
      && profileImage.file instanceof FileUpload
        ? profileImage
        : await this.profileImageRepository.findOne(
            { id, type },
            { populate: ['file'] },
          );

    if (!avatarImage || !avatarImage.isAvailableFor('team', team.id))
      throw new BadRequestException(`Invalid ${type} image`);

    // Get previous avatar image if it exists and set it to inactive
    const previousAvatarImage = await this.profileImageRepository.findOne({
      team,
      type,
      active: true,
    });
    if (previousAvatarImage) {
      previousAvatarImage.active = false;
      previousAvatarImage.lastActiveDate = new Date();
    }

    // Update the team's image
    team[type] = avatarImage.file.url;

    // Update the target type of the image
    avatarImage.team = team;
    avatarImage.active = true;

    await this.profileImageRepository.flush();
  }
}
