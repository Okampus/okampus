import type { ITriggerPayload } from '@novu/node';
import { NotificationType } from '@common/modules/notifications/notification-type.enum';
import { Event } from '@plan/events/event.entity';
import { EventRegistration } from '@plan/registrations/registration.entity';
import type { User } from '@uaa/users/user.entity';
import { Notification } from './base.notification';

export class EventSubscribedUpdatedNotification extends Notification {
  public readonly type = NotificationType.EventSubscribedUpdated;
  public readonly settingName = 'notificationEventSubscribedUpdated';
  public readonly batchable = true;

  constructor(
    private readonly event: Event,
    private readonly meta: { executor: User },
  ) {
    super();
    this.excludedEmails.push(this.meta.executor.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const registrations = await this.entityManager.getRepository(EventRegistration).find({
      event: {
        team: this.event.team,
      },
      user: {
        settings: {
          [this.settingName]: { $gt: 0 },
        },
      },
    }, { populate: ['user'] });

    const users = registrations.map(r => r.user);
    if (this.event.supervisor)
      users.push(this.event.supervisor.user);

    return this.filter(users);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(Event).populate(
      this.event,
      ['team', 'supervisor', 'createdBy'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      executor: this.userToPayload(this.meta.executor),
      event: {
        start: this.event.start,
        end: this.event.end,
        name: this.event.name,
        description: this.event.description,
        price: this.event.price,
        location: this.event.location,
        supervisor: this.event.supervisor ? this.userToPayload(this.event.supervisor.user) : null,
        private: this.event.private,
        meta: this.event.meta,
        team: {
          id: this.event.team.id,
          name: this.event.team.name,
          shortDescription: this.event.team.shortDescription,
          category: this.event.team.category,
          labels: this.event.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
          logo: this.event.team.logo,
          logoDark: this.event.team.logoDark,
          banner: this.event.team.banner,
        },
      },
    };
  }
}
