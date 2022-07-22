import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUpload } from '../files/file-uploads/file-upload.entity';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import type { UserCreationOptions } from '../shared/lib/types/interfaces/user-creation-options.interface';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsService } from '../statistics/statistics.service';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserSearchService } from './user-search.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Statistics) private readonly statisticsRepository: BaseRepository<Statistics>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
    private readonly userSearchService: UserSearchService,
    private readonly statisticsService: StatisticsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOneOrFail({ id }, { refresh: true });
  }

  public async create(options: UserCreationOptions): Promise<User> {
    const user = new User(options);
    if (options?.password)
      await user.setPassword(options.password);

    if (options.avatar)
      await this.setAvatar(options.avatar, 'avatar', user);
    else
      user.avatar = null;

    if (options.banner)
      await this.setAvatar(options.banner, 'banner', user);
    else
      user.banner = null;

    await this.userRepository.persistAndFlush(user);
    await this.userSearchService.add(user);
    return user;
  }

  public async update(requester: User, id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ id }, { populate: ['badges'] });

    const ability = this.caslAbilityFactory.createForUser(requester);
    assertPermissions(ability, Action.Update, user);

    const { avatar, banner, ...dto } = updateUserDto;

    if (typeof avatar !== 'undefined') {
      if (avatar)
        await this.setAvatar(avatar, 'avatar', user);
      else
        user.avatar = null;
    }

    if (typeof banner !== 'undefined') {
      if (banner)
        await this.setAvatar(banner, 'banner', user);
      else
        user.banner = null;
    }

    wrap(user).assign(dto);
    await this.userRepository.flush();

    return user;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<User>> {
    return await this.userRepository.findWithPagination(paginationOptions, {}, { orderBy: { lastname: 'ASC' } });
  }

  public async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ id });
    await this.userSearchService.remove(id);
    await this.userRepository.removeAndFlush(user);
  }

  public async getUserStats(id: string): Promise<Omit<Statistics, 'assign'>> {
    const stats = await this.statisticsRepository.findOneOrFail({ user: { id } });
    const streaks = await this.statisticsService.getAllStreaks(stats);
    return { ...stats, ...streaks };
  }

  public async updateProfileImage(user: User, type: 'avatar' | 'banner', profileImage: ProfileImage): Promise<User> {
    await this.setAvatar(profileImage, type, user);

    await this.userRepository.flush();
    return user;
  }

  private async setAvatar(profileImage: ProfileImage | string, type: 'avatar' | 'banner', user: User): Promise<void> {
    // Get the avatar image and validate it
    const id = typeof profileImage === 'string' ? profileImage : profileImage.id;
    const avatarImage = profileImage instanceof ProfileImage && profileImage.file instanceof FileUpload
      ? profileImage
      : await this.profileImageRepository.findOne({ id }, { populate: ['file'] });

    if (!avatarImage || !avatarImage.isAvailableFor('user', user.id))
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
