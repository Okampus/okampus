import type { ITriggerPayload } from '@novu/node';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';
import { config } from '../../../configs/config';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class BlogSubscribedUpdatedNotification extends Notification {
  public readonly type = NotificationType.BlogSubscribedUpdated;
  public readonly settingName = 'notificationBlogSubscribedUpdated';

  constructor(
    private readonly content: Content,
  ) {
    super();
    this.excludedEmails.push(this.content.author.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const { participants } = this.content.contentMaster!;
    const users = await participants.loadItems();
    const usersWithSettings = await this.entityManager.getRepository(User).populate(users, ['settings']);

    return this.filter(
      usersWithSettings.filter(user => user.settings[this.settingName]),
    );
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
        author: this.userToPayload(this.content.author),
        body: this.content.body,
        date: this.content.createdAt,
        contentMaster: {
          title: this.content.contentMaster!.title,
          url: `${config.network.frontendUrl}/blog/post/${this.content.contentMaster!.id}`,
        },
      },
    };
  }
}