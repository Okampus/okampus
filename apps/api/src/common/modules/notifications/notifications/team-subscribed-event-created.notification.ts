import type { ITriggerPayload } from '@novu/node';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Event } from '@modules/plan/events/event.entity';
import type { User } from '@modules/uaa/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamSubscribedEventCreatedNotification extends Notification {
  public readonly type = NotificationType.TeamSubscribedEventCreated;
  public readonly settingName = 'notificationTeamSubscribedEventCreated';
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

    const members = await this.entityManager.getRepository(TeamMember).find({
      team: this.event.team,
      user: {
        settings: {
          [this.settingName]: { $gt: 0 },
        },
      },
    });

    return this.filter(members.map(member => member.user));
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
