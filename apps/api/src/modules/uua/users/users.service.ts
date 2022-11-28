/* eslint-disable object-curly-newline */

import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import MeiliSearch from 'meilisearch';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { config } from '@common/configs/config';
import { GlobalRequestService } from '@common/lib/helpers/global-request-service';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { UserImageType } from '@common/lib/types/enums/user-image-type.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import type { IndexedEntity } from '@common/modules/search/indexed-entity.interface';
import type { CreateSocialDto } from '@modules/org/teams/socials/dto/create-social.dto';
import { Social } from '@modules/org/teams/socials/social.entity';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import { TenantsService } from '@modules/org/tenants/tenants.service';
import type { RegisterDto } from '../auth/dto/register.dto';
import type { TenantUserDto } from '../auth/dto/tenant-user.dto';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsService } from '../statistics/statistics.service';
import type { CreateUserImageDto } from '../user-images/dto/create-user-image.dto';
import type { UserImage } from '../user-images/user-image.entity';
import { UserImagesService } from '../user-images/user-images.service';
import type { CreateBotDto } from './dto/create-bot.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

const userImageTypeToKey = {
  [UserImageType.Avatar]: 'avatar' as const,
  [UserImageType.Banner]: 'banner' as const,
};

const defaultUserPopulate = ['classMemberships', 'classMemberships.schoolYear', 'classMemberships.schoolClass'];


@Injectable()
export class UsersService extends GlobalRequestService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Social) private readonly socialsRepository: BaseRepository<Social>,
    @InjectRepository(Statistics) private readonly statisticsRepository: BaseRepository<Statistics>,
    private readonly statisticsService: StatisticsService,
    private readonly userImagesService: UserImagesService,
    private readonly tenantsService: TenantsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,
  ) { super(); }

  public async findBareUser(idOrEmail: string): Promise<User> {
    return await this.userRepository.findOneOrFail(
      { $or: [{ id: idOrEmail }, { email: idOrEmail.toLowerCase() }] },
      { fields: ['id', 'password', 'name', 'lastName', 'email', 'avatar', 'roles', 'banner', 'bot', 'points'] },
    );
  }

  public async findOne(id: string): Promise<User> {
    if (id === config.anonAccount.username)
        throw new BadRequestException('Anonymous account cannot be accessed');

    return await this.userRepository.findOneOrFail({ id }, { populate: this.autoGqlPopulate(defaultUserPopulate) });
  }

  public async createBot(createBotDto: CreateBotDto): Promise<User> {
    const user = new User(createBotDto, this.currentTenant());
    user.bot = true;

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Update, user);

    await this.setUserImage(user, UserImageType.Avatar, createBotDto.avatar ?? null);
    await this.setUserImage(user, UserImageType.Banner, createBotDto.banner ?? null);

    await this.userRepository.persistAndFlush(user);
    return user;
  }

  public async create(createUserDto: RegisterDto): Promise<User> {
    const { avatar, banner, password, ...userDto } = createUserDto;
    const user = new User(userDto, this.currentTenant());
    if (await this.findBareUser(user.email) || await this.findBareUser(user.id))
      throw new BadRequestException('User already exists');

    await Promise.all([
      user.setPassword(password),
      this.setUserImage(user, UserImageType.Avatar, createUserDto.avatar ?? null),
      this.setUserImage(user, UserImageType.Banner, createUserDto.banner ?? null),
    ]);

    // TODO: manage users class/cohort memberships on creation and update
    //   if (user.scopeRole === SchoolRole.Student) {
    //     const schoolYear = await this.schoolYearRepository.findOneOrFail({ id: 'school-year-test' });
    //     const schoolClass = await this.classRepository.findOneOrFail({ id: 'group-test' });
    //     const classMembership = new ClassMembership({
    //       user,
    //       schoolClass,
    //       schoolYear,
    //     });
    //     await this.classRepository.persistAndFlush(classMembership);
    //   }
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  public async createBare(createUserDto: TenantUserDto, forTenant: string): Promise<User> {
    const tenant = await this.tenantsService.findOne(forTenant);
    const user = new User(createUserDto, tenant);
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  // Public async create(options: RegisterDto): Promise<{ user: User; token: string | null }> {
  //   const tenant = await this.tenantRepository.findOneOrFail({ id: options.tenantId });
  //   const user = new User({ ...options, tenant });
  //   let token: string | null = null;
  //   if (options.bot) {
  //     token = await this.jwtService.signAsync({ sub: user.id, requestType: RequestType.Http } as TokenClaims, {
  //       secret: config.tokens.secrets.bot,
  //     });
  //     await user.setPassword(token);
  //   } else if (options.password) {
  //     await user.setPassword(options.password);
  //   }

  //   if (options.avatar)
  //     await this.setImage(options.avatar, 'avatar', user);
  //   else
  //     user.avatar = null;

  //   if (options.banner)
  //     await this.setImage(options.banner, 'banner', user);
  //   else
  //     user.banner = null;

  //   await this.userRepository.persistAndFlush(user);

  //   if (user.scopeRole === SchoolRole.Student) {
  //     const schoolYear = await this.schoolYearRepository.findOneOrFail({ id: 'school-year-test' });
  //     const schoolClass = await this.classRepository.findOneOrFail({ id: 'group-test' });
  //     const classMembership = new ClassMembership({
  //       user,
  //       schoolClass,
  //       schoolYear,
  //     });
  //     await this.classRepository.persistAndFlush(classMembership);
  //   }

  //   return { user, token };
  // }

  public async update(requester: User, id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ id }, { populate: ['badges'] });

    const ability = this.caslAbilityFactory.createForUser(requester);
    assertPermissions(ability, Action.Update, user);

    const { avatar, banner, password, ...dto } = updateUserDto;

    if (password)
      await user.setPassword(password);

    if (typeof avatar !== 'undefined')
      await this.setUserImage(user, UserImageType.Avatar, avatar);

    if (typeof banner !== 'undefined')
      await this.setUserImage(user, UserImageType.Banner, banner);

    wrap(user).assign(dto);
    await this.userRepository.flush();

    return user;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<User>> {
    return await this.userRepository.findWithPagination(
      paginationOptions,
      { id: { $ne: config.anonAccount.username } },
      { populate: this.autoGqlPopulate(defaultUserPopulate) },
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

  public async addSocialAccount(user: User, id: string, createSocialDto: CreateSocialDto): Promise<Social> {
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

  public async addUserImage(file: MulterFile, createUserImageDto: CreateUserImageDto): Promise<User> {
    const userImage = await this.userImagesService.create(file, createUserImageDto);
    if (userImage.type === UserImageType.Avatar || userImage.type === UserImageType.Banner)
      return await this.setUserImage(userImage.user, userImage.type, userImage);

    return userImage.user;
  }

  public async setUserImage(
    user: User,
    type: UserImageType.Avatar | UserImageType.Banner,
    userImage: UserImage | string | null,
  ): Promise<User> {
    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, user);

    if (typeof userImage === 'string') // UserImage passed by ID
      userImage = await this.userImagesService.findOne(userImage);

    if (userImage)
      userImage.active = true;

    user[userImageTypeToKey[type]] = userImage;
    await this.userImagesService.setInactiveLastActive(user.id, type);

    await this.userRepository.flush();
    return user;
  }
}
