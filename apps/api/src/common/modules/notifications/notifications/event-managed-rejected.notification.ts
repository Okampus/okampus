
import type { ITriggerPayload } from '@novu/node';
import { Event } from '@modules/plan/events/event.entity';
import type { User } from '@modules/uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class EventManagedRejectedNotification extends Notification {
  public readonly type = NotificationType.EventManagedRejected;
  public readonly settingName = 'notificationEventManagedRejected';
  public readonly batchable = true;

  constructor(
    private readonly event: Event,
    private readonly meta: { message?: string },
  ) {
    super();
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const boardUsers = await this.getTeamBoard(this.event.team);
    boardUsers.push(this.event.createdBy);

    if (this.event.supervisor)
      boardUsers.push(this.event.supervisor.user);

    return this.filter(boardUsers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(Event).populate(
      this.event,
      ['team', 'supervisor', 'createdBy'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      message: this.meta.message,
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
          avatar: this.event.team.avatar,
          banner: this.event.team.banner,
        },
      },
    };
  }
}