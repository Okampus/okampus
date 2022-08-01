import type { ITriggerPayload } from '@novu/node';
import { TeamEvent } from '../../../../teams/events/team-event.entity';
import type { User } from '../../../../users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamManagedEventUpdatedNotification extends Notification {
  public readonly type = NotificationType.TeamManagedEventUpdated;
  public readonly settingName = 'notificationTeamManagedEventUpdated';
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

    const boardUsers = await this.getTeamBoard(this.teamEvent.team);
    return this.filter(boardUsers);
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
        supervisor: this.teamEvent.supervisor ? this.userToPayload(this.teamEvent.supervisor) : null,
        private: this.teamEvent.private,
        meta: this.teamEvent.meta,
        team: {
          id: this.teamEvent.team.id,
          name: this.teamEvent.team.name,
          shortDescription: this.teamEvent.team.shortDescription,
          category: this.teamEvent.team.category,
          tags: this.teamEvent.team.tags,
          avatar: this.teamEvent.team.avatar,
          banner: this.teamEvent.team.banner,
        },
      },
    };
  }
}
