import type { ITriggerPayload } from '@novu/node';
import { NotificationType } from '@common/modules/notifications/notification-type.enum';
import { config } from '@configs/config';
import { Content } from '@create/contents/entities/content.entity';
import type { User } from '@uaa/users/user.entity';
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
