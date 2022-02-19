import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { UserCreationOptions } from '../shared/lib/types/user-creation-options.interface';
import type { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsService } from '../statistics/statistics.service';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserSearchService } from './user-search.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Statistics) private readonly statisticsRepository: BaseRepository<Statistics>,
    private readonly userSearchService: UserSearchService,
    private readonly statisticsService: StatisticsService,
  ) {}

  public async findOneById(userId: string): Promise<User> {
    return await this.userRepository.findOneOrFail({ userId });
  }

  public async create(options: UserCreationOptions): Promise<User> {
    const user = new User(options);
    if (options?.password)
      await user.setPassword(options.password);
    await this.userRepository.persistAndFlush(user);
    await this.userSearchService.add(user);
    return user;
  }

  public async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ userId }, { populate: ['badges'] });

    wrap(user).assign(updateUserDto);
    await this.userRepository.flush();

    return user;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<User>> {
    return await this.userRepository.findWithPagination(paginationOptions, {}, { orderBy: { lastname: 'ASC' } });
  }

  public async getUserStats(userId: string): Promise<Statistics> {
    const stats = await this.statisticsRepository.findOneOrFail({ user: { userId } });
    const streaks = await this.statisticsService.getAllStreaks(stats);
    return { ...stats, ...streaks };
  }
}
