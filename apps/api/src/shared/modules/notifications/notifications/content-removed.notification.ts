import type { ITriggerPayload } from '@novu/node';
import { Content } from '../../../../contents/entities/content.entity';
import type { User } from '../../../../users/user.entity';
import { config } from '../../../configs/config';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class ContentRemovedNotification extends Notification {
  public readonly type = NotificationType.ContentRemoved;
  public readonly settingName = 'notificationContentRemoved';

  constructor(
    private readonly content: Content,
  ) {
    super();
  }

  public getNotifiees(): Set<User> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    return this.filter(this.content.author);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(Content).populate(
      this.content,
      ['author', 'contentMaster'],
    );
  }

  public getPayload(user: User): ITriggerPayload {
    return {
      recipient: this.userToPayload(user),
      content: {
        body: this.content.body,
        date: this.content.createdAt,
        contentMaster: {
          title: this.content.contentMaster!.title,
          url: `${config.network.frontendUrl}/forum/post/${this.content.contentMaster!.id}`,
        },
      },
    };
  }
}
