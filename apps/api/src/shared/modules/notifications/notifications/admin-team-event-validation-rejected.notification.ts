import type { ITriggerPayload } from '@novu/node';
import { TeamEventValidation } from '../../../../org/teams/event-validations/team-event-validation.entity';
import type { User } from '../../../../uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminTeamEventValidationRejectedNotification extends Notification {
  public readonly type = NotificationType.AdminTeamEventValidationRejected;
  public readonly settingName = 'notificationAdminTeamEventValidationRejected';
  public readonly batchable = true;

  constructor(
    private readonly teamEventValidation: TeamEventValidation,
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
    await this.entityManager.getRepository(TeamEventValidation).populate(
      this.teamEventValidation,
      ['user', 'event', 'event.createdBy', 'event.supervisor', 'event.team', 'step'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      validation: {
        id: this.teamEventValidation.id,
        message: this.teamEventValidation.message,
        user: this.userToPayload(this.teamEventValidation.user),
        event: {
          start: this.teamEventValidation.event.start,
          end: this.teamEventValidation.event.end,
          name: this.teamEventValidation.event.name,
          description: this.teamEventValidation.event.description,
          price: this.teamEventValidation.event.price,
          location: this.teamEventValidation.event.location,
          supervisor: this.teamEventValidation.event.supervisor
            ? this.userToPayload(this.teamEventValidation.event.supervisor.user)
            : null,
          private: this.teamEventValidation.event.private,
          meta: this.teamEventValidation.event.meta,
          team: {
            id: this.teamEventValidation.event.team.id,
            name: this.teamEventValidation.event.team.name,
            shortDescription: this.teamEventValidation.event.team.shortDescription,
            category: this.teamEventValidation.event.team.category,
          labels: this.teamEventValidation
                .event.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
            avatar: this.teamEventValidation.event.team.avatar,
            banner: this.teamEventValidation.event.team.banner,
          },
        },
      },
    };
  }
}
