import type { ITriggerPayload } from '@novu/node';
import { Thread } from '@modules/create/threads/thread.entity';
import type { User } from '@modules/uaa/users/user.entity';
import { config } from '../../../configs/config';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminThreadAssignedNotification extends Notification {
  public readonly type = NotificationType.AdminThreadAssigned;
  public readonly settingName = 'notificationAdminThreadAssigned';

  constructor(
    private readonly contentMaster: Thread,
    private readonly user: User,
  ) {
    super();
  }

  public getNotifiees(): Set<User> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    return this.filter(this.user);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(Thread).populate(
      this.contentMaster,
      ['post', 'post.author', 'adminValidations', 'assignedUsers', 'tags'],
    );
  }

  public getPayload(user: User): ITriggerPayload {
    return {
      recipient: this.userToPayload(user),
      contentMaster: {
        content: {
          author: this.userToPayload(this.contentMaster.post.author),
          body: this.contentMaster.post.body,
          date: this.contentMaster.post.createdAt,
        },
        title: this.contentMaster.title,
        type: this.contentMaster.type,
        tags: this.contentMaster.tags.getItems().map(tag => tag.name),
        locked: this.contentMaster.locked,
        assignees: this.contentMaster.assignedUsers.getItems().map(this.userToPayload),
        url: `${config.network.frontendUrl}/forum/post/${this.contentMaster.id}`,
      },
    };
  }
}
