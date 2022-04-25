import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
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

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Badge>> {
    return await this.badgeRepository.findWithPagination(paginationOptions, {}, { orderBy: { createdAt: 'DESC' } });
  }

  public async findOne(badgeId: number): Promise<Badge> {
    return await this.badgeRepository.findOneOrFail({ badgeId });
  }

  public async update(badgeId: number, updateBadgeDto: UpdateBadgeDto): Promise<Badge> {
    const badge = await this.badgeRepository.findOneOrFail({ badgeId });

    wrap(badge).assign(updateBadgeDto);
    await this.badgeRepository.flush();
    return badge;
  }

  public async remove(badgeId: number): Promise<void> {
    const badge = await this.badgeRepository.findOneOrFail({ badgeId });
    await this.badgeRepository.removeAndFlush(badge);
  }

  public async unlockForUser(badgeId: number, user: User): Promise<BadgeUnlock> {
    const badge = await this.badgeRepository.findOneOrFail({ badgeId });
    const badgeUnlock = new BadgeUnlock({ badge, user });
    await this.badgeUnlockRepository.persistAndFlush(badgeUnlock);
    return badgeUnlock;
  }

  public async findAllForUser(
    userId: string,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<BadgeUnlock>> {
    return await this.badgeUnlockRepository.findWithPagination(
      paginationOptions,
      { user: { userId } },
      { populate: ['badge', 'user'], orderBy: { createdAt: 'DESC' } },
    );
  }
}
