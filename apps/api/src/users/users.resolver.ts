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
import { APP_PUB_SUB } from '../shared/lib/constants';
import { CurrentTenant } from '../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { SubscriptionType } from '../shared/lib/types/enums/subscription-type.enum';
import { PaginateDto } from '../shared/modules/pagination';
import type { IndexedEntity } from '../shared/modules/search/indexed-entity.interface';
import { Social } from '../socials/social.entity';
import { SocialsService } from '../socials/socials.service';
import { Interest } from '../teams/interests/interest.entity';
import { InterestsService } from '../teams/interests/interests.service';
import { Tenant } from '../tenants/tenants/tenant.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { IndexedUser } from './user-indexed.model';
import { User } from './user.entity';
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
    return await this.usersService.findOneById(id);
  }

  @ResolveField(() => [Social])
  public async socials(@Parent() user: User): Promise<Social[]> {
    return await this.socialsService.findAllUserSocials(user.id);
  }

  @Query(() => [User])
  public async users(): Promise<User[]> {
    const paginatedUsers = await this.usersService.findAll();
    return paginatedUsers.items;
  }

  // TODO: Add permission checks
  @Query(() => [IndexedUser])
  public async searchUsers(
    @CurrentTenant() tenant: Tenant,
    @Args('search') search: string,
    @Args('query', { nullable: true }) query: PaginateDto,
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
    const updatedUser = await this.usersService.update(requester, id, user);
    await this.pubSub.publish(SubscriptionType.UserUpdated, { userUpdated: updatedUser });
    return updatedUser;
  }

  @Subscription(() => User)
  public updatedUser(): AsyncIterator<User> {
    return this.pubSub.asyncIterator(SubscriptionType.UserUpdated);
  }
}
