import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import type { UserCreationOptions } from '../shared/lib/types/interfaces/user-creation-options.interface';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
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
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
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

    const { avatar, banner, ...dto } = updateUserDto;

    if (typeof avatar !== 'undefined')
      await this.setAvatar(avatar, 'avatar', user);

    if (typeof banner !== 'undefined')
      await this.setAvatar(banner, 'banner', user);

    wrap(user).assign(dto);
    await this.userRepository.flush();

    return user;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<User>> {
    return await this.userRepository.findWithPagination(paginationOptions, {}, { orderBy: { lastname: 'ASC' } });
  }

  public async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ userId });
    await this.userSearchService.remove(userId);
    await this.userRepository.removeAndFlush(user);
  }

  public async getUserStats(userId: string): Promise<Statistics> {
    const stats = await this.statisticsRepository.findOneOrFail({ user: { userId } });
    const streaks = await this.statisticsService.getAllStreaks(stats);
    return { ...stats, ...streaks };
  }

  private async setAvatar(profileImageId: string, type: 'avatar' | 'banner', user: User): Promise<void> {
    // Get the avatar image and validate it
    const avatarImage = await this.profileImageRepository.findOne({ profileImageId }, { populate: ['file'] });
    if (!avatarImage || !avatarImage.isAvailableFor('user', user.userId))
      throw new BadRequestException(`Invalid ${type} image`);

    // Update the user's image
    user[type] = avatarImage.file.url;

    // Update the target type of the image
    if (!avatarImage.user) {
      avatarImage.user = user;
      await this.profileImageRepository.flush();
    }
  }
}
