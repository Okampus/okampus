import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateThreadDto } from './dto/create-thread.dto';
import { Thread } from './thread.entity';
import { ThreadsService } from './threads.service';

@Resolver(() => Thread)
export class ThreadResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSubEngine,
    private readonly threadsService: ThreadsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [Thread])
  public async thread(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int, nullable: true }) id: number,
  ): Promise<Thread[]> {
    if (typeof id === 'number') {
      const thread = await this.threadsService.findOne(user, id);
      return [thread];
    }

    const paginatedThreads = await this.threadsService.findAll(user);
    return paginatedThreads.items;
  }

  @Mutation(() => Thread)
  public async addThread(@CurrentUser() user: User, @Args('thread') thread: CreateThreadDto): Promise<Thread> {
    const createdThread = await this.threadsService.create(user, thread);
    await this.pubSub.publish('threadAdded', { threadAdded: createdThread });
    return createdThread;
  }

  @Subscription(() => Thread)
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public threadAdded() { // eslint-disable-line @typescript-eslint/explicit-function-return-type
    const subscriber = this.pubSub.asyncIterator('threadAdded');
    return subscriber;
  }
}
