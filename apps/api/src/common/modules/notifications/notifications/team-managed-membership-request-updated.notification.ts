import type { ITriggerPayload } from '@novu/node';
import { TeamMembershipRequest } from '@modules/org/teams/requests/team-membership-request.entity';
import type { User } from '@modules/uua/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamManagedMembershipRequestUpdatedNotification extends Notification {
  public readonly type = NotificationType.TeamManagedMembershipRequestUpdated;
  public readonly settingName = 'notificationTeamManagedMembershipRequestUpdated';
  public readonly batchable = true;

  constructor(
    private readonly teamMembershipRequest: TeamMembershipRequest,
  ) {
    super();
    if (this.teamMembershipRequest.handledBy)
      this.excludedEmails.push(this.teamMembershipRequest.handledBy.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const boardUsers = await this.getTeamBoard(this.teamMembershipRequest.team);
    return this.filter(boardUsers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamMembershipRequest).populate(
      this.teamMembershipRequest,
      ['team', 'team', 'user', 'handledBy', 'issuedBy'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      request: {
        user: this.userToPayload(this.teamMembershipRequest.user),
        id: this.teamMembershipRequest.id,
        issuer: this.teamMembershipRequest.issuer,
        state: this.teamMembershipRequest.state,
        issuedBy: this.userToPayload(this.teamMembershipRequest.issuedBy),
        role: this.teamMembershipRequest.role,
        handledAt: this.teamMembershipRequest.handledAt,
        handledMessage: this.teamMembershipRequest.handledMessage,
        handledBy: this.teamMembershipRequest.handledBy
          ? this.userToPayload(this.teamMembershipRequest.handledBy)
          : null,
        team: {
          id: this.teamMembershipRequest.team.id,
          name: this.teamMembershipRequest.team.name,
          shortDescription: this.teamMembershipRequest.team.shortDescription,
          category: this.teamMembershipRequest.team.category,
          labels: this.teamMembershipRequest
                    .team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
          avatar: this.teamMembershipRequest.team.avatar,
          banner: this.teamMembershipRequest.team.banner,
        },
      },
    };
  }
}
