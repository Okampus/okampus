/* eslint-disable object-curly-newline */

import type { EntityField } from '@mikro-orm/core';
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
import type { FullPageInfo } from '@common/lib/types/interfaces/full-page-info.interface';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { catchUniqueViolation } from '@common/lib/utils/catch-unique-violation';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
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
const bareUserFields: Array<EntityField<User, string>> = [
  'id', 'password', 'name', 'lastName', 'email', 'avatar', 'roles', 'banner', 'bot', 'points',
];

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

  public async findBareUser(idOrEmail: string): Promise<User | null> {
    const where = { $or: [{ id: idOrEmail }, { email: idOrEmail.toLowerCase() }] };
    return await this.userRepository.findOneOrFail(where, { fields: bareUserFields });
  }

  public async findBareUsers(ids: string[]): Promise<User[]> {
    return await this.userRepository.find({ id: { $in: ids } }, { fields: bareUserFields });
  }

  public async findOne(id: string): Promise<User> {
    if (id === config.anonAccount.username)
        throw new BadRequestException('Anonymous account cannot be accessed');

    return await this.userRepository.findOneOrFail({ id }, { populate: this.autoGqlPopulate(defaultUserPopulate) });
  }

  public async createBot(createBotDto: CreateBotDto): Promise<User> {
    const { avatar, banner, ...createBot } = createBotDto;

    const user = new User(createBot, this.currentTenant());
    await catchUniqueViolation(this.userRepository, user);

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Update, user);

    await Promise.all([
      this.setImage(user, UserImageType.Avatar, avatar ?? null),
      this.setImage(user, UserImageType.Banner, banner ?? null),
    ]);

    user.bot = true;
    await this.userRepository.flush();
    return user;
  }

  public async create(createUserDto: RegisterDto): Promise<User> {
    const { avatar, banner, password, ...userDto } = createUserDto;
    const user = new User(userDto, this.currentTenant());
    await catchUniqueViolation(this.userRepository, user);

    await Promise.all([
      user.setPassword(password),
      this.setImage(user, UserImageType.Avatar, avatar ?? null),
      this.setImage(user, UserImageType.Banner, banner ?? null),
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
    await this.userRepository.flush();
    return user;
  }

  public async createBare(createUserDto: TenantUserDto, tenantSlug: string): Promise<User> {
    const tenant = await this.tenantsService.findBareTenant(tenantSlug);
    if (!tenant)
      throw new BadRequestException('Tenant does not exist');

    const user = new User(createUserDto, tenant);

    await catchUniqueViolation(this.userRepository, user);
    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ id }, { populate: ['badges'] });

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Update, user);

    const { avatar, banner, password, ...updateUser } = updateUserDto;

    await Promise.all([
      password && user.setPassword(password),
      typeof avatar !== 'undefined' && this.setImage(user, UserImageType.Avatar, avatar ?? null),
      typeof banner !== 'undefined' && this.setImage(user, UserImageType.Banner, banner ?? null),
    ]);

    wrap(user).assign(updateUser);
    await this.userRepository.flush();

    return user;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedNodes<User>> {
    return await this.userRepository.findWithPagination(
      paginationOptions,
      { id: { $ne: config.anonAccount.username } },
      { populate: this.autoGqlPopulate(defaultUserPopulate) },
    );
  }

  public async search(
    tenant: Tenant,
    query: PaginationOptions & { search: string },
  ): Promise<FullPageInfo<IndexedEntity>> {
    const result = await this.meiliSearch.index(tenant.slug).search(
      query.search,
      {
        filter: 'metaType = user',
        limit: query?.limit ?? 20,
        offset: query?.offset ?? 0,
      },
    );

    const page = Math.floor(result.offset! / result.limit!);
    return {
      items: result.hits as IndexedEntity[],
      itemsPerPage: result.limit!,
      itemCount: result.hits.length,
      totalItemCount: result.estimatedTotalHits!,
      totalPages: Math.ceil(result.estimatedTotalHits! / result.limit!),
      offset: result.offset! - page * result.limit!,
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

  public async getStats(id: string): Promise<Omit<Statistics, 'assign'>> {
    const stats = await this.statisticsRepository.findOneOrFail({ user: { id } });
    const streaks = await this.statisticsService.getAllStreaks(stats);
    return { ...stats, ...streaks };
  }

  public async addImage(file: MulterFile, createUserImageDto: CreateUserImageDto): Promise<User> {
    const userImage = await this.userImagesService.create(file, createUserImageDto);
    if (userImage.type === UserImageType.Avatar || userImage.type === UserImageType.Banner) {
      const user = await this.setImage(userImage.user, userImage.type, userImage);

      await this.userRepository.flush();
      return user;
    }

    return userImage.user;
  }

  public async setImage(
    user: User,
    type: UserImageType.Avatar | UserImageType.Banner,
    userImage: UserImage | string | null,
  ): Promise<User> {
    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Update, user);

    if (typeof userImage === 'string') // UserImage passed by ID
      userImage = await this.userImagesService.findOne(userImage);

    if (userImage)
      userImage.active = true;

    await this.userImagesService.setInactiveLastActive(user.id, type);

    user[userImageTypeToKey[type]] = userImage;


    return user;
  }
}
