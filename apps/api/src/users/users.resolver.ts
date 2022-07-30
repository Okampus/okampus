import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '../shared/lib/constants';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { SubscriptionType } from '../shared/lib/types/enums/subscription-type.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly usersService: UsersService,
  ) {}

  // TODO: Add permission checks
  @Query(() => User)
  public async userById(@Args('id') id: string): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Query(() => [User])
  public async users(): Promise<User[]> {
    const paginatedUsers = await this.usersService.findAll();
    return paginatedUsers.items;
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
  public updatedThread(): AsyncIterator<User> {
    return this.pubSub.asyncIterator(SubscriptionType.UserUpdated);
  }
}
