import type { ITriggerPayload } from '@novu/node';
import { Content } from '../../../../create/contents/entities/content.entity';
import type { User } from '../../../../uua/users/user.entity';
import { config } from '../../../configs/config';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class ThreadSubscribedAnsweredNotification extends Notification {
  public readonly type = NotificationType.ThreadSubscribedAnswered;
  public readonly settingName = 'notificationThreadSubscribedAnswered';
  public readonly batchable = true;

  constructor(
    private readonly content: Content,
    private readonly meta: { executor: User },
  ) {
    super();
    this.excludedEmails.push(this.meta.executor.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const { participants } = this.content.contentMaster!;
    const users = await participants.loadItems();
    const usersWithSettings = await this.entityManager.populate(users, ['settings']);

    return this.filter(
      usersWithSettings.filter(user => user.settings[this.settingName]),
    );
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(Content).populate(
      this.content,
      ['author', 'contentMaster', 'contentMaster.validations', 'contentMaster.validations.user'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      executor: this.userToPayload(this.meta.executor),
      content: {
        author: this.userToPayload(this.content.author),
        body: this.content.body,
        date: this.content.createdAt,
        contentMaster: {
          tags: this.content.contentMaster!.tags.getItems().map(tag => tag.name),
          title: this.content.contentMaster!.title,
          validations: this.content.contentMaster!.validations.getItems().map(validation => ({
            user: this.userToPayload(validation.user),
            date: validation.createdAt,
            type: validation.type,
          })),
          url: `${config.network.frontendUrl}/forum/post/${this.content.contentMaster!.id}`,
        },
      },
    };
  }
}
