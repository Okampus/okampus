import type { ITriggerPayload } from '@novu/node';
import type { Content } from '../../../../contents/entities/content.entity';
import type { User } from '../../../../users/user.entity';
import { computedConfig } from '../../../configs/config';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class ThreadSubscribedUpdatedNotification extends Notification {
  public readonly type = NotificationType.ThreadSubscribedUpdated;
  public readonly settingName = 'notificationThreadSubscribedUpdated';

  constructor(
    private readonly content: Content,
  ) {
    super();
    this.excludedEmails.push(this.content.author.email);
  }

  public async getNotifiees(): Promise<User[]> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const { participants } = this.content.contentMaster!;
    const users = await participants.loadItems();
    const usersWithSettings = await this.entityManager.populate(users, ['settings']);

    return this.filter(
      usersWithSettings.filter(user => user.settings[this.settingName]),
    );
  }

  public getPayload(user: User): ITriggerPayload {
    return {
      executor: this.userToPayload(user),
      content: {
        executor: this.userToPayload(this.content.author),
        body: this.content.body,
        date: this.content.createdAt,
        contentMaster: {
          title: this.content.contentMaster!.title,
          url: `${computedConfig.frontendUrl}/forum/post/${this.content.contentMaster!.id}`,
        },
      },
    };
  }
}
