import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
// Import { AdminTeamLegalFileUpdatedNotification } from '@common/modules/notifications/notifications';
import { NotificationsService } from '@common/modules/notifications/notifications.service';
import type { PaginatedResult } from '@common/modules/pagination';
import { Team } from '@modules/org/teams/team.entity';
import type { CreateTeamGalleryDto } from '@modules/upload/team-galleries/dto/create-team-gallery.dto';
import type { User } from '@modules/uua/users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { TeamGalleryListOptions } from './dto/team-gallery-list-options.dto';
import type { UpdateTeamGalleryDto } from './dto/update-team-gallery.dto';
import { TeamGallery } from './team-gallery.entity';

@Injectable()
export class TeamGalleriesService {
  constructor(
    @InjectRepository(TeamGallery) private readonly teamGalleryRepository: BaseRepository<TeamGallery>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,

    private readonly notificationsService: NotificationsService,
  ) {}

  public async create(
    user: User,
    createGalleryImageDto: CreateTeamGalleryDto,
    file: FileUpload,
  ): Promise<TeamGallery> {
    const { teamId, ...createGalleryImage } = createGalleryImageDto;

    const team = await this.teamRepository.findOneOrFail({ id: teamId }, { populate: ['members'] });

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const teamGallery = new TeamGallery({
      ...createGalleryImage,
      team,
      file,
      active: true,
    });
    await this.teamGalleryRepository.persistAndFlush(teamGallery);

    // Void this.notificationsService.trigger(
    //   new AdminTeamLegalFileUpdatedNotification(teamGallery, { executor: user }),
    // );

    return teamGallery;
  }

  public async findOne(id: string): Promise<TeamGallery> {
    return await this.teamGalleryRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team'] },
    );
  }

  public async findAll(
    options: Required<TeamGalleryListOptions>,
  ): Promise<PaginatedResult<TeamGallery>> {
    const team = await this.teamRepository.findOneOrFail({ id: options.id });

    const query = {};
    // Const query = options.type ? { type: options.type } : {};

    return await this.teamGalleryRepository.findWithPagination(
      options,
      { team, ...query },
      { populate: ['file', 'file.user', 'team'] },
    );
  }

  public async update(
    user: User,
    id: string,
    updateGalleryImageDto: UpdateTeamGalleryDto,
  ): Promise<TeamGallery> {
    const teamGallery = await this.teamGalleryRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team', 'team.members'] },
    );

    if (!teamGallery.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    wrap(teamGallery).assign(updateGalleryImageDto);
    await this.teamGalleryRepository.persistAndFlush(teamGallery);

    // Void this.notificationsService.trigger(
    //   new AdminTeamLegalFileUpdatedNotification(teamGallery, { executor: user }),
    // );

    return teamGallery;
  }

  public async remove(user: User, id: string): Promise<void> {
    const teamGallery = await this.teamGalleryRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'team', 'team.members'] },
    );

    if (!teamGallery.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.teamGalleryRepository.removeAndFlush(teamGallery);

    // Void this.notificationsService.trigger(
    //   new AdminTeamLegalFileUpdatedNotification(teamGallery, { executor: user }),
    // );
  }
}
