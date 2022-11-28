/* eslint-disable object-curly-newline */
import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { GlobalRequestService } from '@common/lib/helpers/global-request-service';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { TeamImageType } from '@common/lib/types/enums/team-image-type.enum';
import { TeamRole } from '@common/lib/types/enums/team-role.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { catchUniqueViolation } from '@common/lib/utils/catch-unique-violation';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { Label } from '@modules/catalog/labels/label.entity';
import type { CreateTeamDto } from '@modules/org/teams/dto/create-team.dto';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import type { CreateSocialDto } from '@modules/org/teams/socials/dto/create-social.dto';
import type { User } from '@modules/uaa/users/user.entity';
import type { Tenant } from '../tenants/tenant.entity';
import type { TeamsFilterDto } from './dto/teams-filter.dto';
import type { UpdateTeamDto } from './dto/update-team.dto';
import { TeamMember } from './members/team-member.entity';
import { Social } from './socials/social.entity';
import type { CreateTeamImageDto } from './team-images/dto/create-team-image.dto';
import type { TeamImage } from './team-images/team-image.entity';
import { TeamImagesService } from './team-images/team-images.service';
import { Team } from './team.entity';

const teamImageTypeToKey = {
  [TeamImageType.Logo]: 'logo' as const,
  [TeamImageType.LogoDark]: 'logoDark' as const,
  [TeamImageType.Banner]: 'banner' as const,
};

@Injectable()
export class TeamsService extends GlobalRequestService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(Label) private readonly teamLabelRepository: BaseRepository<Label>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(Social) private readonly socialsRepository: BaseRepository<Social>,
    private readonly teamImagesService: TeamImagesService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { super(); }

  public async create(
    tenant: Tenant,
    user: User,
    createTeamDto: CreateTeamDto,
  ): Promise<Team> {
    const { logo, logoDark, banner, labels, ...createTeam } = createTeamDto;

    const team = new Team({ ...createTeam, tenant });
    await catchUniqueViolation(this.teamRepository, team);

    const existingLabels = await this.teamLabelRepository.find({ name: { $in: labels } });
    const existingLabelsNames = new Set(existingLabels.map(label => label.name));
    const newLabels = labels?.filter(name => !existingLabelsNames.has(name)).map(name => new Label({ name }));

    if (newLabels && newLabels.length > 0)
      await this.teamLabelRepository.persistAndFlush(newLabels);

    team.labels.add(...existingLabels, ...newLabels ?? []);

    await Promise.all([
      this.setImage(team, TeamImageType.Logo, logo ?? null),
      this.setImage(team, TeamImageType.LogoDark, logoDark ?? null),
      this.setImage(team, TeamImageType.Banner, banner ?? null),
    ]);

    const member = new TeamMember({ user, team, role: TeamRole.Owner });
    await this.teamMemberRepository.persistAndFlush(member);
    await this.teamRepository.flush();

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

  public async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamRepository.findOneOrFail({ id }, { populate: ['members', 'membershipRequestForm'] });

    // TODO: Move this to CASL
    if (!team.canAdminister(this.currentUser()))
      throw new ForbiddenException('Not a team admin');

    const { logo, logoDark, banner, membershipRequestFormId, labels: wantedLabels, ...dto } = updateTeamDto;

    if (wantedLabels) {
      if (wantedLabels.length === 0)
        team.labels.removeAll();
       else
        team.labels.set(await this.teamLabelRepository.find({ name: { $in: wantedLabels } }));
    }

    await Promise.all([
      typeof logo !== 'undefined' && this.setImage(team, TeamImageType.Logo, logo ?? null),
      typeof logoDark !== 'undefined' && this.setImage(team, TeamImageType.LogoDark, logoDark ?? null),
      typeof banner !== 'undefined' && this.setImage(team, TeamImageType.Banner, banner ?? null),
    ]);

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

  public async addImage(file: MulterFile, createTeamImageDto: CreateTeamImageDto): Promise<Team> {
    const teamImage = await this.teamImagesService.create(file, createTeamImageDto);
    if (
      teamImage.type === TeamImageType.Logo
      || teamImage.type === TeamImageType.Banner
      || teamImage.type === TeamImageType.LogoDark
    ) {
      const team = await this.setImage(teamImage.team, teamImage.type, teamImage);

      await this.teamRepository.flush();
      return team;
    }

    return teamImage.team;
  }

  public async setImage(
    team: Team,
    type: TeamImageType.Banner | TeamImageType.Logo | TeamImageType.LogoDark,
    teamImage: TeamImage | string | null,
  ): Promise<Team> {
    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Update, team);

    if (typeof teamImage === 'string') // TeamImage passed by ID
      teamImage = await this.teamImagesService.findOne(teamImage);

    if (teamImage)
      teamImage.active = true;

    await this.teamImagesService.setInactiveLastActive(team.id, type);
    team[teamImageTypeToKey[type]] = teamImage;

    return team;
  }
}
