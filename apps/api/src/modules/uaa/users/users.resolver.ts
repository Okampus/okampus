import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '@common/lib/constants';
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { SubscriptionType } from '@common/lib/types/enums/subscription-type.enum';
import { PaginationOptions } from '@common/modules/pagination';
import type { IndexedEntity } from '@common/modules/search/indexed-entity.interface';
import { Interest } from '@modules/org/teams/interests/interest.entity';
import { InterestsService } from '@modules/org/teams/interests/interests.service';
import { Social } from '@modules/org/teams/socials/social.entity';
import { SocialsService } from '@modules/org/teams/socials/socials.service';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { IndexedUser } from '../../../common/lib/types/models/user-indexed.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedUser, User } from './user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly usersService: UsersService,
    private readonly socialsService: SocialsService,
    private readonly interestsService: InterestsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => User)
  public async userById(@Args('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @ResolveField(() => [Social])
  public async socials(@Parent() user: User): Promise<Social[]> {
    return await this.socialsService.findAllUserSocials(user.id);
  }

  @Query(() => PaginatedUser)
  public async users(): Promise<PaginatedUser> {
    return await this.usersService.findAll();
  }

  // TODO: Add permission checks
  @Query(() => [IndexedUser])
  public async searchUsers(
    @CurrentTenant() tenant: Tenant,
    @Args('search') search: string,
    @Args('query', { nullable: true }) query: PaginationOptions,
  ): Promise<IndexedEntity[]> {
    const paginatedUsers = await this.usersService.search(tenant, { ...query, search });
    return paginatedUsers.items;
  }

  @ResolveField(() => [Interest])
  public async interests(@Parent() user: User): Promise<Interest[]> {
    return await this.interestsService.findAllbyUser(user.id);
  }

  @Mutation(() => User)
  public async updateUser(
    @CurrentUser() requester: User,
    @Args('id') id: string,
    @Args('user') user: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(id, user);
    await this.pubSub.publish(SubscriptionType.UserUpdated, { userUpdated: updatedUser });
    return updatedUser;
  }

  @Subscription(() => User)
  public updatedUser(): AsyncIterator<User> {
    return this.pubSub.asyncIterator(SubscriptionType.UserUpdated);
  }
}
