
import type { ITriggerPayload } from '@novu/node';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import type { User } from '@modules/uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class EventManagedRegistrationCreatedNotification extends Notification {
  public readonly type = NotificationType.EventManagedRegistrationCreated;
  public readonly settingName = 'notificationEventManagedRegistrationCreated';
  public readonly batchable = true;

  constructor(
    private readonly eventRegistration: EventRegistration,
  ) {
    super();
    this.excludedEmails.push(this.eventRegistration.user.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const boardUsers = await this.getTeamBoard(this.eventRegistration.event.team);
    boardUsers.push(this.eventRegistration.event.createdBy);

    if (this.eventRegistration.event.supervisor)
      boardUsers.push(this.eventRegistration.event.supervisor.user);

    return this.filter(boardUsers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(EventRegistration).populate(
      this.eventRegistration,
      ['event.team', 'event.supervisor', 'event.createdBy', 'user'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      registration: {
        id: this.eventRegistration.id,
        status: this.eventRegistration.status,
        user: this.userToPayload(this.eventRegistration.user),
        event: {
          start: this.eventRegistration.event.start,
          end: this.eventRegistration.event.end,
          name: this.eventRegistration.event.name,
          description: this.eventRegistration.event.description,
          price: this.eventRegistration.event.price,
          location: this.eventRegistration.event.location,
          supervisor: this.eventRegistration.event.supervisor
            ? this.userToPayload(this.eventRegistration.event.supervisor.user)
            : null,
          private: this.eventRegistration.event.private,
          meta: this.eventRegistration.event.meta,
          team: {
            id: this.eventRegistration.event.team.id,
            name: this.eventRegistration.event.team.name,
            shortDescription: this.eventRegistration.event.team.shortDescription,
            category: this.eventRegistration.event.team.category,
            labels: this.eventRegistration
              .event.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
            avatar: this.eventRegistration.event.team.avatar,
            banner: this.eventRegistration.event.team.banner,
          },
        },
      },
    };
  }
}
