import type { ChangeSet, EventSubscriber, FlushEventArgs } from '@mikro-orm/core';
import { ChangeSetType, Subscriber } from '@mikro-orm/core';
import { Statistics } from '../statistics/statistics.entity';
import { User } from './user.entity';

@Subscriber()
export class ContentSubscriber implements EventSubscriber {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async onFlush(args: FlushEventArgs): Promise<void> {
    const changeSets = args.uow.getChangeSets();
    const change = changeSets.find((cs): cs is ChangeSet<User> =>
      cs.type === ChangeSetType.CREATE && cs.entity instanceof User);

    if (change) {
      change.entity.statistics = new Statistics({ user: change.entity });
      args.uow.computeChangeSet(change.entity.statistics);
      args.uow.recomputeSingleChangeSet(change.entity);
    }
  }
}
