import type { ITriggerPayload } from '@novu/node';
import { EventApproval } from '@modules/plan/approvals/approval.entity';
import type { User } from '@modules/uaa/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminEventValidationRejectedNotification extends Notification {
  public readonly type = NotificationType.AdminEventValidationRejected;
  public readonly settingName = 'notificationAdminEventValidationRejected';
  public readonly batchable = true;

  constructor(
    private readonly approval: EventApproval,
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
    await this.entityManager.getRepository(EventApproval).populate(
      this.approval,
      ['user', 'event', 'event.createdBy', 'event.supervisor', 'event.team', 'step'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      approval: {
        id: this.approval.id,
        message: this.approval.message,
        user: this.userToPayload(this.approval.user),
        event: {
          start: this.approval.event.start,
          end: this.approval.event.end,
          name: this.approval.event.name,
          description: this.approval.event.description,
          price: this.approval.event.price,
          location: this.approval.event.location,
          supervisor: this.approval.event.supervisor
            ? this.userToPayload(this.approval.event.supervisor.user)
            : null,
          private: this.approval.event.private,
          meta: this.approval.event.meta,
          team: {
            id: this.approval.event.team.id,
            name: this.approval.event.team.name,
            shortDescription: this.approval.event.team.shortDescription,
            category: this.approval.event.team.category,
            labels: this.approval.event.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
            logo: this.approval.event.team.logo,
            logoDark: this.approval.event.team.logoDark,
            banner: this.approval.event.team.banner,
          },
        },
      },
    };
  }
}
