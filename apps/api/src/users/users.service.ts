import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Token } from '../auth/auth.guard';
import { FileUpload } from '../files/file-uploads/file-upload.entity';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { SchoolGroupMembership } from '../school-group/memberships/school-group-membership.entity';
import { SchoolGroup } from '../school-group/school-group.entity';
import { SchoolYear } from '../school-group/school-year/school-year.entity';
import { config } from '../shared/configs/config';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import type { UserCreationOptions } from '../shared/lib/types/interfaces/user-creation-options.interface';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsService } from '../statistics/statistics.service';
import { Tenant } from '../tenants/tenants/tenant.entity';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    @InjectRepository(Statistics) private readonly statisticsRepository: BaseRepository<Statistics>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
    @InjectRepository(SchoolGroup)
      private readonly schoolGroupRepository: BaseRepository<SchoolGroup>,
    @InjectRepository(SchoolYear)
      private readonly schoolYearRepository: BaseRepository<SchoolYear>,
    private readonly statisticsService: StatisticsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly jwtService: JwtService,
  ) {}

  public async findOneById(id: string): Promise<User> {
    if (id === config.get('anonAccount.username'))
        throw new BadRequestException('Anonymous account cannot be accessed');

    return await this.userRepository.findOneOrFail({ id }, {
      refresh: true,
      populate: [
        'schoolGroupMemberships',
        'schoolGroupMemberships.schoolYear',
        'schoolGroupMemberships.schoolGroup',
        'teamMemberships',
        'teamMemberships.team',
        'teamMembershipRequests',
        'teamMembershipRequests.team',
      ],
    });
  }

  public async create(options: UserCreationOptions): Promise<{ user: User; token: string | null }> {
    const tenant = await this.tenantRepository.findOneOrFail({ id: options.tenantId });
    const user = new User({ ...options, tenant });
    let token: string | null = null;
    if (options.bot) {
      token = await this.jwtService.signAsync({ sub: user.id, typ: 'bot', aud: 'http' } as Token, {
        secret: config.get('tokens.botTokenSecret'),
      });
      await user.setPassword(token);
    } else if (options.password) {
      await user.setPassword(options.password);
    }

    if (options.avatar)
      await this.setAvatar(options.avatar, 'avatar', user);
    else
      user.avatar = null;

    if (options.banner)
      await this.setAvatar(options.banner, 'banner', user);
    else
      user.banner = null;

    await this.userRepository.persistAndFlush(user);

    if (user.schoolRole === SchoolRole.Student) {
      const schoolYear = await this.schoolYearRepository.findOneOrFail({ id: 'school-year-test' });
      const schoolGroup = await this.schoolGroupRepository.findOneOrFail({ id: 'group-test' });
      const schoolGroupMembership = new SchoolGroupMembership({
        user,
        schoolGroup,
        schoolYear,
      });
      await this.schoolGroupRepository.persistAndFlush(schoolGroupMembership);
    }

    return { user, token };
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
    return await this.userRepository.findWithPagination(
      paginationOptions,
      { id: { $ne: config.get('anonAccount.username') } },
      {
        orderBy: { lastname: 'ASC' },
        populate: [
          'schoolGroupMemberships',
          'schoolGroupMemberships.schoolYear',
          'schoolGroupMemberships.schoolGroup',
          'teamMemberships',
          'teamMemberships.team',
        ],
      },
    );
  }

  public async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ id });
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
