import type { ITriggerPayload } from '@novu/node';
import { TeamEventRegistration } from '../../../../org/teams/event-registrations/team-event-registration.entity';
import { TeamEvent } from '../../../../org/teams/events/team-event.entity';
import type { User } from '../../../../uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamEventSubscribedUpdatedNotification extends Notification {
  public readonly type = NotificationType.TeamEventSubscribedUpdated;
  public readonly settingName = 'notificationTeamEventSubscribedUpdated';
  public readonly batchable = true;

  constructor(
    private readonly teamEvent: TeamEvent,
    private readonly meta: { executor: User },
  ) {
    super();
    this.excludedEmails.push(this.meta.executor.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const registrations = await this.entityManager.getRepository(TeamEventRegistration).find({
      event: {
        team: this.teamEvent.team,
      },
      user: {
        settings: {
          [this.settingName]: { $gt: 0 },
        },
      },
    }, { populate: ['user'] });

    const users = registrations.map(r => r.user);
    if (this.teamEvent.supervisor)
      users.push(this.teamEvent.supervisor.user);

    return this.filter(users);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamEvent).populate(
      this.teamEvent,
      ['team', 'supervisor', 'createdBy'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      executor: this.userToPayload(this.meta.executor),
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
