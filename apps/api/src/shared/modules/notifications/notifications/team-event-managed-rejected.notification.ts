
import type { ITriggerPayload } from '@novu/node';
import { TeamEvent } from '../../../../teams/events/team-event.entity';
import type { User } from '../../../../users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamEventManagedRejectedNotification extends Notification {
  public readonly type = NotificationType.TeamEventManagedRejected;
  public readonly settingName = 'notificationTeamEventManagedRejected';
  public readonly batchable = true;

  constructor(
    private readonly teamEvent: TeamEvent,
    private readonly meta: { message?: string },
  ) {
    super();
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const boardUsers = await this.getTeamBoard(this.teamEvent.team);
    boardUsers.push(this.teamEvent.createdBy);

    if (this.teamEvent.supervisor)
      boardUsers.push(this.teamEvent.supervisor);

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
      message: this.meta.message,
      event: {
        start: this.teamEvent.start,
        end: this.teamEvent.end,
        name: this.teamEvent.name,
        description: this.teamEvent.description,
        price: this.teamEvent.price,
        place: this.teamEvent.place,
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
