import type { ITriggerPayload } from '@novu/node';
import { NotificationType } from '@common/modules/notifications/notification-type.enum';
import { Event } from '@plan/events/event.entity';
import type { User } from '@uaa/users/user.entity';
import { Notification } from './base.notification';

export class AdminEventValidationApprovedNotification extends Notification {
  public readonly type = NotificationType.AdminEventValidationApproved;
  public readonly settingName = 'notificationAdminEventValidationApproved';
  public readonly batchable = true;

  constructor(
    private readonly event: Event,
  ) {
    super();
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const admins = await this.getAdmins(this.settingName);
    return this.filter(admins);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(Event).populate(
      this.event,
      ['team', 'supervisor', 'createdBy'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
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
