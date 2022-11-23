import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import MeiliSearch from 'meilisearch';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { config } from '@common/configs/config';
import { BaseRepository } from '@common/lib/orm/base.repository';
import type { TokenClaims } from '@common/lib/types/interfaces/token-claims.interface';
import type { UserCreationOptions } from '@common/lib/types/interfaces/user-creation-options.interface';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { SchoolRole } from '@common/modules/authorization/types/school-role.enum';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import type { IndexedEntity } from '@common/modules/search/indexed-entity.interface';
import { Class } from '@modules/org/classes/class.entity';
import { ClassMembership } from '@modules/org/classes/memberships/class-membership.entity';
import { SchoolYear } from '@modules/org/classes/school-year/school-year.entity';
import type { CreateSocialDto } from '@modules/org/teams/socials/dto/create-social.dto';
import { Social } from '@modules/org/teams/socials/social.entity';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { FileUpload } from '@modules/store/file-uploads/file-upload.entity';
import { ProfileImage } from '@modules/store/profile-images/profile-image.entity';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsService } from '../statistics/statistics.service';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    @InjectRepository(Social) private readonly socialsRepository: BaseRepository<Social>,
    @InjectRepository(Statistics) private readonly statisticsRepository: BaseRepository<Statistics>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
    @InjectRepository(Class)
      private readonly classRepository: BaseRepository<Class>,
    @InjectRepository(SchoolYear)
      private readonly schoolYearRepository: BaseRepository<SchoolYear>,
    private readonly statisticsService: StatisticsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly jwtService: JwtService,
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,
  ) {}

  public async findOneById(id: string): Promise<User> {
    if (id === config.anonAccount.username)
        throw new BadRequestException('Anonymous account cannot be accessed');

    return await this.userRepository.findOneOrFail({ id }, {
      refresh: true,
      populate: [
        'interests',
        'classMemberships',
        'classMemberships.schoolYear',
        'classMemberships.schoolClass',
        'teamMemberships',
        'teamMemberships.team',
        'teamMembershipRequests',
        'teamMembershipRequests.team',
        'teamMembershipRequests.handledBy',
        'teamMembershipRequests.originalForm',
        'teamMembershipRequests.issuedBy',
      ],
    });
  }

  public async create(options: UserCreationOptions): Promise<{ user: User; token: string | null }> {
    const tenant = await this.tenantRepository.findOneOrFail({ id: options.tenantId });
    const user = new User({ ...options, tenant });
    let token: string | null = null;
    if (options.bot) {
      token = await this.jwtService.signAsync({ sub: user.id, tokenType: 'http' } as TokenClaims, {
        secret: config.tokens.botTokenSecret,
      });
      await user.setPassword(token);
    } else if (options.password) {
      await user.setPassword(options.password);
    }

    if (options.avatar)
      await this.setImage(options.avatar, 'avatar', user);
    else
      user.avatar = null;

    if (options.banner)
      await this.setImage(options.banner, 'banner', user);
    else
      user.banner = null;

    await this.userRepository.persistAndFlush(user);

    if (user.schoolRole === SchoolRole.Student) {
      const schoolYear = await this.schoolYearRepository.findOneOrFail({ id: 'school-year-test' });
      const schoolClass = await this.classRepository.findOneOrFail({ id: 'group-test' });
      const classMembership = new ClassMembership({
        user,
        schoolClass,
        schoolYear,
      });
      await this.classRepository.persistAndFlush(classMembership);
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
        await this.setImage(avatar, 'avatar', user);
      else
        user.avatar = null;
    }

    if (typeof banner !== 'undefined') {
      if (banner)
        await this.setImage(banner, 'banner', user);
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
      { id: { $ne: config.anonAccount.username } },
      {
        orderBy: { lastname: 'ASC' },
        populate: [
          'classMemberships',
          'classMemberships.schoolYear',
          'classMemberships.schoolClass',
          'teamMemberships',
          'teamMemberships.team',
        ],
      },
    );
  }

  public async search(
    tenant: Tenant,
    query: PaginateDto & { search: string },
  ): Promise<PaginatedResult<IndexedEntity>> {
    const result = await this.meiliSearch.index(tenant.id).search(
      query.search,
      {
        filter: 'metaType = user',
        limit: query?.itemsPerPage ?? 20,
        offset: (query?.itemsPerPage ?? 20) * ((query?.page ?? 1) - 1),
      },
    );

    const page = Math.floor(result.offset / result.limit);
    return {
      items: result.hits as IndexedEntity[],
      itemsPerPage: result.limit,
      itemCount: result.hits.length,
      totalItemCount: result.estimatedTotalHits,
      totalPages: Math.ceil(result.estimatedTotalHits / result.limit),
      offset: result.offset - page * result.limit,
      page,
    };
  }

  public async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ id });
    await this.userRepository.removeAndFlush(user);
  }

  public async addSocialAccount(
    user: User,
    id: string,
    createSocialDto: CreateSocialDto,
  ): Promise<Social> {
    const targetUser = await this.userRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, targetUser);

    const social = new Social({ ...createSocialDto, user });
    await this.socialsRepository.persistAndFlush(social);
    return social;
  }

  public async getUserStats(id: string): Promise<Omit<Statistics, 'assign'>> {
    const stats = await this.statisticsRepository.findOneOrFail({ user: { id } });
    const streaks = await this.statisticsService.getAllStreaks(stats);
    return { ...stats, ...streaks };
  }

  public async updateProfileImage(user: User, type: 'avatar' | 'banner', profileImage: ProfileImage): Promise<User> {
    await this.setImage(profileImage, type, user);

    await this.userRepository.flush();
    return user;
  }

  private async setImage(profileImage: ProfileImage | string, type: 'avatar' | 'banner', user: User): Promise<void> {
    // Get the avatar image and validate it
    const id = typeof profileImage === 'string' ? profileImage : profileImage.id;
    const avatarImage = profileImage instanceof ProfileImage && profileImage.file instanceof FileUpload
      ? profileImage
      : await this.profileImageRepository.findOne({ id }, { populate: ['file'] });

    if (!avatarImage || !avatarImage.isAvailableFor('user', user.id))
      throw new BadRequestException(`Invalid ${type} image`);

    // Get previous avatar image if it exists and set it to inactive
    const previousAvatarImage = await this.profileImageRepository.findOne({ user, type, active: true });
    if (previousAvatarImage) {
      previousAvatarImage.active = false;
      previousAvatarImage.lastActiveDate = new Date();
    }

    // Update the user's image
    user[type] = avatarImage.file.url;

    // Update the target type of the image
    avatarImage.user = user;
    avatarImage.active = true;

    await this.profileImageRepository.flush();
  }
}
