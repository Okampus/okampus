import type { ITriggerPayload } from '@novu/node';
import { NotificationType } from '@common/modules/notifications/notification-type.enum';
import { EventRegistration } from '@plan/registrations/registration.entity';
import type { User } from '@uaa/users/user.entity';
import { Notification } from './base.notification';

export class EventManagedRegistrationCreatedNotification extends Notification {
  public readonly type = NotificationType.EventManagedRegistrationCreated;
  public readonly settingName = 'notificationEventManagedRegistrationCreated';
  public readonly batchable = true;

  constructor(
    private readonly registration: EventRegistration,
  ) {
    super();
    this.excludedEmails.push(this.registration.user.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const boardUsers = await this.getTeamBoard(this.registration.event.team);
    boardUsers.push(this.registration.event.createdBy);

    if (this.registration.event.supervisor)
      boardUsers.push(this.registration.event.supervisor.user);

    return this.filter(boardUsers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(EventRegistration).populate(
      this.registration,
      ['event.team', 'event.supervisor', 'event.createdBy', 'user'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      registration: {
        id: this.registration.id,
        status: this.registration.status,
        user: this.userToPayload(this.registration.user),
        event: {
          start: this.registration.event.start,
          end: this.registration.event.end,
          name: this.registration.event.name,
          description: this.registration.event.description,
          price: this.registration.event.price,
          location: this.registration.event.location,
          supervisor: this.registration.event.supervisor
            ? this.userToPayload(this.registration.event.supervisor.user)
            : null,
          private: this.registration.event.private,
          meta: this.registration.event.meta,
          team: {
            id: this.registration.event.team.id,
            name: this.registration.event.team.name,
            shortDescription: this.registration.event.team.shortDescription,
            category: this.registration.event.team.category,
            labels: this.registration.event.team.labels.getItems().map(_ => ({ name: _.name, type: _.type })),
              logo: this.registration.event.team.logo,
              logoDark: this.registration.event.team.logoDark,
              banner: this.registration.event.team.banner,
          },
        },
      },
    };
  }
}
