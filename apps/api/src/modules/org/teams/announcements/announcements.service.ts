import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { AnnouncementState } from '@common/lib/types/enums/announcement-state.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import type { CreateAnnouncementDto } from '@modules/org/teams/announcements/dto/create-announcement.dto';
import type { User } from '@modules/uaa/users/user.entity';
import { Announcement } from './announcement.entity';
import type ListAnnouncementsDto from './dto/list-announcements.dto';
import type { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement) private readonly announcementRepository: BaseRepository<Announcement>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createdBy: User, createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = new Announcement({ ...createAnnouncementDto, createdBy });
    await this.announcementRepository.persistAndFlush(announcement);
    return announcement;
  }

  public async findAll(
    user: User,
    query: ListAnnouncementsDto,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedNodes<Announcement>> {
    let filter: FilterQuery<Announcement> = { state: AnnouncementState.Committed };

    const now = new Date();

    if (this.caslAbilityFactory.isModOrAdmin(user)) {
      filter = (typeof query.state === 'undefined' || query.state === 'all') ? {} : { state: query.state };
    } else {
      filter = query.state === 'all'
        ? { state: AnnouncementState.Committed, displayFrom: { $lte: now } }
        : { state: AnnouncementState.Committed, displayFrom: { $lte: now }, displayUntil: { $gte: now } };
    }

    return await this.announcementRepository.findWithPagination(
      paginationOptions,
      filter,
      // FIXME: Enable orderBy with pagination
      // { orderBy: { priority: 'DESC' } },
    );
  }

  public async findOne(user: User, id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, announcement);

    return announcement;
  }

  public async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOneOrFail({ id });

    wrap(announcement).assign(updateAnnouncementDto);
    await this.announcementRepository.flush();
    return announcement;
  }

  public async remove(id: number): Promise<void> {
    const announcement = await this.announcementRepository.findOneOrFail({ id });
    await this.announcementRepository.removeAndFlush(announcement);
  }
}
