import type { ITriggerPayload } from '@novu/node';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { Event } from '@modules/plan/events/event.entity';
import type { User } from '@modules/uaa/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminEventValidationStartedNotification extends Notification {
  public readonly type = NotificationType.AdminEventValidationStarted;
  public readonly settingName = 'notificationAdminEventValidationStarted';
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

    const validationStep = await this.entityManager.getRepository(ApprovalStep).findOneOrFail({ step: 0 }, {
      populate: ['users'],
    });
    return this.filter(validationStep.users.getItems());
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
          avatar: this.event.team.avatar,
          banner: this.event.team.banner,
        },
      },
    };
  }
}
