import type { ITriggerPayload } from '@novu/node';
import type { Content } from '../../../../contents/entities/content.entity';
import type { User } from '../../../../users/user.entity';
import { computedConfig } from '../../../configs/config';
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

  public getNotifiees(): User[] {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    return this.filter(this.content.author);
  }

  public getPayload(user: User): ITriggerPayload {
    return {
      recipient: this.userToPayload(user),
      content: {
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
