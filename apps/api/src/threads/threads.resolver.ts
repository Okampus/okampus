import {
  Args,
  Int,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Thread } from './thread.entity';
import { ThreadsService } from './threads.service';

@Resolver(() => Thread)
export class ThreadResolver {
  constructor(
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
}
