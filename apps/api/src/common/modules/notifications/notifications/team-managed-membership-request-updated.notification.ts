import type { ITriggerPayload } from '@novu/node';
import { NotificationType } from '@common/modules/notifications/notification-type.enum';
import { TeamMembershipRequest } from '@teams/requests/team-membership-request.entity';
import type { User } from '@uaa/users/user.entity';
import { Notification } from './base.notification';

export class TeamManagedMembershipRequestUpdatedNotification extends Notification {
  public readonly type = NotificationType.TeamManagedMembershipRequestUpdated;
  public readonly settingName = 'notificationTeamManagedMembershipRequestUpdated';
  public readonly batchable = true;

  constructor(
    private readonly request: TeamMembershipRequest,
  ) {
    super();
    if (this.request.handledBy)
      this.excludedEmails.push(this.request.handledBy.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const boardUsers = await this.getTeamBoard(this.request.team);
    return this.filter(boardUsers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamMembershipRequest).populate(
      this.request,
      ['team', 'team', 'user', 'handledBy', 'issuedBy'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      request: {
        user: this.userToPayload(this.request.user),
        id: this.request.id,
        issuer: this.request.issuer,
        state: this.request.state,
        issuedBy: this.userToPayload(this.request.issuedBy),
        role: this.request.role,
        handledAt: this.request.handledAt,
        handledMessage: this.request.handledMessage,
        handledBy: this.request.handledBy ? this.userToPayload(this.request.handledBy) : null,
        team: {
          id: this.request.team.id,
          name: this.request.team.name,
          shortDescription: this.request.team.shortDescription,
          category: this.request.team.category,
          labels: this.request.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
          logo: this.request.team.logo,
          logoDark: this.request.team.logoDark,
          banner: this.request.team.banner,
        },
      },
    };
  }
}
