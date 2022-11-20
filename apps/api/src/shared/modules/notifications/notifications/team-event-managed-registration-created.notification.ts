
import type { ITriggerPayload } from '@novu/node';
import { TeamEventRegistration } from '../../../../org/teams/event-registrations/team-event-registration.entity';
import type { User } from '../../../../uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamEventManagedRegistrationCreatedNotification extends Notification {
  public readonly type = NotificationType.TeamEventManagedRegistrationCreated;
  public readonly settingName = 'notificationTeamEventManagedRegistrationCreated';
  public readonly batchable = true;

  constructor(
    private readonly teamEventRegistration: TeamEventRegistration,
  ) {
    super();
    this.excludedEmails.push(this.teamEventRegistration.user.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const boardUsers = await this.getTeamBoard(this.teamEventRegistration.event.team);
    boardUsers.push(this.teamEventRegistration.event.createdBy);

    if (this.teamEventRegistration.event.supervisor)
      boardUsers.push(this.teamEventRegistration.event.supervisor.user);

    return this.filter(boardUsers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamEventRegistration).populate(
      this.teamEventRegistration,
      ['event.team', 'event.supervisor', 'event.createdBy', 'user'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      registration: {
        id: this.teamEventRegistration.id,
        status: this.teamEventRegistration.status,
        user: this.userToPayload(this.teamEventRegistration.user),
        event: {
          start: this.teamEventRegistration.event.start,
          end: this.teamEventRegistration.event.end,
          name: this.teamEventRegistration.event.name,
          description: this.teamEventRegistration.event.description,
          price: this.teamEventRegistration.event.price,
          location: this.teamEventRegistration.event.location,
          supervisor: this.teamEventRegistration.event.supervisor
            ? this.userToPayload(this.teamEventRegistration.event.supervisor.user)
            : null,
          private: this.teamEventRegistration.event.private,
          meta: this.teamEventRegistration.event.meta,
          team: {
            id: this.teamEventRegistration.event.team.id,
            name: this.teamEventRegistration.event.team.name,
            shortDescription: this.teamEventRegistration.event.team.shortDescription,
            category: this.teamEventRegistration.event.team.category,
            labels: this.teamEventRegistration
              .event.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
            avatar: this.teamEventRegistration.event.team.avatar,
            banner: this.teamEventRegistration.event.team.banner,
          },
        },
      },
    };
  }
}
