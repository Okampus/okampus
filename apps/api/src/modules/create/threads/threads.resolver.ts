import { Inject } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '@common/lib/constants';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { SubscriptionType } from '@common/lib/types/enums/subscription-type.enum';
import type { Interactions } from '@modules/create/contents/interactions.model';
import { CreateThreadDto } from '@modules/create/threads/dto/create-thread.dto';
import { User } from '@modules/uua/users/user.entity';
import { ContentsService } from '../contents/contents.service';
import type { Content } from '../contents/entities/content.entity';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Thread } from './thread.entity';
import { ThreadsService } from './threads.service';

export interface ContextBatchContents {
  batchInteractions: Record<number, Interactions>;
  batchContents: Record<number, Content[]>;
}

@Resolver(() => Thread)
export class ThreadResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly threadsService: ThreadsService,
    private readonly contentsService: ContentsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Thread, { nullable: true })
  public async threadById(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Context() batchContext: ContextBatchContents,
  ): Promise<Thread | null> {
    const thread = await this.threadsService.findOne(user, id);
    batchContext.batchInteractions = await this.contentsService.getInteractionsByMaster(user.id, id);
    batchContext.batchContents = await this.contentsService.getContentsByMaster(id);

    return thread;
  }

  @Query(() => [Thread])
  public async threads(@CurrentUser() user: User): Promise<Thread[]> {
    const paginatedThreads = await this.threadsService.findAll(user);
    return paginatedThreads.items;
  }

  @Mutation(() => Thread)
  public async createThread(@CurrentUser() user: User, @Args('thread') thread: CreateThreadDto): Promise<Thread> {
    const createdThread = await this.threadsService.create(user, thread);
    await this.pubSub.publish(SubscriptionType.ThreadAdded, { threadAdded: createdThread });
    return createdThread;
  }

  @Mutation(() => Thread)
  public async updateThread(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('thread') thread: UpdateThreadDto,
  ): Promise<Thread> {
    const updatedThread = await this.threadsService.update(user, id, thread);
    await this.pubSub.publish(SubscriptionType.ThreadUpdated, { threadUpdated: updatedThread });
    return updatedThread;
  }

  @Subscription(() => Thread)
  public threadAdded(): AsyncIterator<Thread> {
    return this.pubSub.asyncIterator(SubscriptionType.ThreadAdded);
  }

  @Subscription(() => Thread)
  public updatedThread(): AsyncIterator<Thread> {
    return this.pubSub.asyncIterator(SubscriptionType.ThreadUpdated);
  }
}
