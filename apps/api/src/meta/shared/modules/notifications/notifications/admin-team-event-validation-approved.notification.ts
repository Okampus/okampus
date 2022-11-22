import type { ITriggerPayload } from '@novu/node';
import { TeamEvent } from '@modules/plan/events/team-event.entity';
import type { User } from '@modules/uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminTeamEventValidationApprovedNotification extends Notification {
  public readonly type = NotificationType.AdminTeamEventValidationApproved;
  public readonly settingName = 'notificationAdminTeamEventValidationApproved';
  public readonly batchable = true;

  constructor(
    private readonly teamEvent: TeamEvent,
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
    await this.entityManager.getRepository(TeamEvent).populate(
      this.teamEvent,
      ['team', 'supervisor', 'createdBy'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      event: {
        start: this.teamEvent.start,
        end: this.teamEvent.end,
        name: this.teamEvent.name,
        description: this.teamEvent.description,
        price: this.teamEvent.price,
        location: this.teamEvent.location,
        supervisor: this.teamEvent.supervisor ? this.userToPayload(this.teamEvent.supervisor.user) : null,
        private: this.teamEvent.private,
        meta: this.teamEvent.meta,
        team: {
          id: this.teamEvent.team.id,
          name: this.teamEvent.team.name,
          shortDescription: this.teamEvent.team.shortDescription,
          category: this.teamEvent.team.category,
          labels: this.teamEvent.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
          avatar: this.teamEvent.team.avatar,
          banner: this.teamEvent.team.banner,
        },
      },
    };
  }
}
