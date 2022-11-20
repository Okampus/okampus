import type { ITriggerPayload } from '@novu/node';
import { TeamEvent } from '../../../../org/teams/events/team-event.entity';
import { TeamMember } from '../../../../org/teams/members/team-member.entity';
import type { User } from '../../../../uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamSubscribedEventCreatedNotification extends Notification {
  public readonly type = NotificationType.TeamSubscribedEventCreated;
  public readonly settingName = 'notificationTeamSubscribedEventCreated';
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

    const members = await this.entityManager.getRepository(TeamMember).find({
      team: this.teamEvent.team,
      user: {
        settings: {
          [this.settingName]: { $gt: 0 },
        },
      },
    });

    return this.filter(members.map(member => member.user));
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
