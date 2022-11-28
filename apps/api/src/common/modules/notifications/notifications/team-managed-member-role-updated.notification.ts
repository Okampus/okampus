import type { ITriggerPayload } from '@novu/node';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import type { User } from '@modules/uaa/users/user.entity';
import type { TeamRole } from '../../../lib/types/enums/team-role.enum';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class TeamManagedMemberRoleUpdatedNotification extends Notification {
  public readonly type = NotificationType.TeamManagedMemberRoleUpdated;
  public readonly settingName = 'notificationTeamManagedMemberRoleUpdated';
  public readonly batchable = true;

  constructor(
    private readonly teamMember: TeamMember,
    private readonly meta: { executor: User; previousRole: TeamRole; previousLabel?: string | null },
  ) {
    super();
    this.excludedEmails.push(this.meta.executor.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

      const boardUsers = await this.getTeamBoard(this.teamMember.team);
      return this.filter(boardUsers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamMember).populate(
      this.teamMember,
      ['team', 'user'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      executor: this.userToPayload(this.meta.executor),
      member: {
        user: this.userToPayload(this.teamMember.user),
        id: this.teamMember.id,
        previousRole: this.meta.previousRole,
        previousLabel: this.meta.previousLabel,
        role: this.teamMember.role,
        roleLabel: this.teamMember.roleLabel,
        team: {
          id: this.teamMember.team.id,
          name: this.teamMember.team.name,
          shortDescription: this.teamMember.team.shortDescription,
          category: this.teamMember.team.category,
          labels: this.teamMember.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
          logo: this.teamMember.team.logo,
          logoDark: this.teamMember.team.logoDark,
          banner: this.teamMember.team.banner,
        },
      },
    };
  }
}
