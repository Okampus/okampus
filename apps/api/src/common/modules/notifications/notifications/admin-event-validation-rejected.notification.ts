import type { ITriggerPayload } from '@novu/node';
import { EventApproval } from '@modules/plan/approvals/approval.entity';
import type { User } from '@modules/uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminEventValidationRejectedNotification extends Notification {
  public readonly type = NotificationType.AdminEventValidationRejected;
  public readonly settingName = 'notificationAdminEventValidationRejected';
  public readonly batchable = true;

  constructor(
    private readonly eventApproval: EventApproval,
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
      this.eventApproval,
      ['user', 'event', 'event.createdBy', 'event.supervisor', 'event.team', 'step'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      approval: {
        id: this.eventApproval.id,
        message: this.eventApproval.message,
        user: this.userToPayload(this.eventApproval.user),
        event: {
          start: this.eventApproval.event.start,
          end: this.eventApproval.event.end,
          name: this.eventApproval.event.name,
          description: this.eventApproval.event.description,
          price: this.eventApproval.event.price,
          location: this.eventApproval.event.location,
          supervisor: this.eventApproval.event.supervisor
            ? this.userToPayload(this.eventApproval.event.supervisor.user)
            : null,
          private: this.eventApproval.event.private,
          meta: this.eventApproval.event.meta,
          team: {
            id: this.eventApproval.event.team.id,
            name: this.eventApproval.event.team.name,
            shortDescription: this.eventApproval.event.team.shortDescription,
            category: this.eventApproval.event.team.category,
          labels: this.eventApproval
                .event.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
            avatar: this.eventApproval.event.team.avatar,
            banner: this.eventApproval.event.team.banner,
          },
        },
      },
    };
  }
}
