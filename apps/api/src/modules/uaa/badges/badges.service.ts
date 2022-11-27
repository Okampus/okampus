import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import type { PaginatedNodes, PaginationArgs } from '@common/modules/pagination';
import type { User } from '../users/user.entity';
import type { CreateBadgeDto } from './dto/create-badge.dto';
import type { UpdateBadgeDto } from './dto/update-badge.dto';
import { BadgeUnlock } from './entities/badge-unlock.entity';
import { Badge } from './entities/badge.entity';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge) private readonly badgeRepository: BaseRepository<Badge>,
    @InjectRepository(BadgeUnlock) private readonly badgeUnlockRepository: BaseRepository<BadgeUnlock>,
  ) {}

  public async create(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const badge = new Badge(createBadgeDto);
    await this.badgeRepository.persistAndFlush(badge);

    return badge;
  }

  public async findAll(paginationOptions?: PaginationArgs): Promise<PaginatedNodes<Badge>> {
    // FIXME: Enable orderBy with pagination
    // return await this.badgeRepository.findWithPagination(paginationOptions, {}, { orderBy: { createdAt: 'DESC' } });
    return await this.badgeRepository.findWithPagination(paginationOptions, {});
  }

  public async findOne(id: number): Promise<Badge> {
    return await this.badgeRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateBadgeDto: UpdateBadgeDto): Promise<Badge> {
    const badge = await this.badgeRepository.findOneOrFail({ id });

    wrap(badge).assign(updateBadgeDto);
    await this.badgeRepository.flush();
    return badge;
  }

  public async remove(id: number): Promise<void> {
    const badge = await this.badgeRepository.findOneOrFail({ id });
    await this.badgeRepository.removeAndFlush(badge);
  }

  public async unlockForUser(id: number, user: User): Promise<BadgeUnlock> {
    const badge = await this.badgeRepository.findOneOrFail({ id });
    const badgeUnlock = new BadgeUnlock({ badge, user });
    await this.badgeUnlockRepository.persistAndFlush(badgeUnlock);
    return badgeUnlock;
  }

  public async findAllForUser(
    id: string,
    paginationOptions?: PaginationArgs,
  ): Promise<PaginatedNodes<BadgeUnlock>> {
    return await this.badgeUnlockRepository.findWithPagination(
      paginationOptions,
      { user: { id } },
      // FIXME: Enable orderBy with pagination
      // { populate: ['badge', 'user'], orderBy: { createdAt: 'DESC' } },
      { populate: ['badge', 'user'] },
    );
  }
}
