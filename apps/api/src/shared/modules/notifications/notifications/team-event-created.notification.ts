import type { FilterQuery } from '@mikro-orm/core';
import type { ITriggerPayload } from '@novu/node';
import type { TeamEvent } from '../../../../teams/events/team-event.entity';
import { TeamMember } from '../../../../teams/members/team-member.entity';
import { User } from '../../../../users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamEventCreatedNotification extends Notification {
  public readonly type = NotificationType.TeamEventCreated;
  public readonly settingName = 'notificationTeamEventCreated';
  public readonly batchable = true;

  constructor(
    private readonly teamEvent: TeamEvent,
    private readonly meta: { executor: User },
  ) {
    super();
    this.excludedEmails.push(this.meta.executor.email);
  }

  public async getNotifiees(): Promise<User[]> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const filters: FilterQuery<User> = {};
    if (this.teamEvent.private) {
      const members = await this.entityManager.getRepository(TeamMember).find({ team: this.teamEvent.team });
      filters.id = { $in: members.map(member => member.user.id) };
    }

    const users = await this.entityManager.getRepository(User).find({
      ...filters,
      settings: {
        [this.settingName]: { $gt: 0 },
      },
    });

    return this.filter(users);
  }

  public getPayload(): ITriggerPayload {
    return {
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
