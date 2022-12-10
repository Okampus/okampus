import type { ChangeSet, EventSubscriber, FlushEventArgs } from '@mikro-orm/core';
import { ChangeSetType, Subscriber } from '@mikro-orm/core';
import { Settings } from '@uaa/settings/settings.entity';
import { Statistics } from '@uaa/statistics/statistics.entity';
import { User } from './user.entity';

@Subscriber()
export class UserSubscriber implements EventSubscriber {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async onFlush(args: FlushEventArgs): Promise<void> {
    // FIXME: @noftaly fix this
    const changeSets = args.uow.getChangeSets() as unknown as Array<ChangeSet<User>>;
    const change = changeSets.find((cs): cs is ChangeSet<User> =>
      cs.type === ChangeSetType.CREATE && cs.entity instanceof User);

    if (change) {
      change.entity.statistics = new Statistics({ user: change.entity });
      change.entity.settings = new Settings({ user: change.entity });
      args.uow.computeChangeSet(change.entity.statistics);
      args.uow.computeChangeSet(change.entity.settings);
      args.uow.recomputeSingleChangeSet(change.entity);
    }
  }
}
