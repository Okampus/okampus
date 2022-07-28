import type { ITriggerPayload } from '@novu/node';
import { TeamContactAccount } from '../../../../contacts/entities/team-contact-account.entity';
import type { User } from '../../../../users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminTeamContactUpdatedNotification extends Notification {
  public readonly type = NotificationType.AdminTeamContactUpdated;
  public readonly settingName = 'notificationAdminTeamContactUpdated';
  public readonly batchable = true;

  constructor(
    private readonly teamContactAccount: TeamContactAccount,
    private readonly meta: { executor: User; previousLink?: string | null; previousPseudo?: string },
  ) {
    super();
    this.excludedEmails.push(this.meta.executor.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const admins = await this.getAdmins(this.settingName);
    return this.filter(admins);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamContactAccount).populate(
      this.teamContactAccount,
      ['team', 'contact'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      executor: this.userToPayload(this.meta.executor),
      teamContactAccount: {
        id: this.teamContactAccount.id,
        team: {
          id: this.teamContactAccount.team.id,
          name: this.teamContactAccount.team.name,
          shortDescription: this.teamContactAccount.team.shortDescription,
          category: this.teamContactAccount.team.category,
          tags: this.teamContactAccount.team.tags,
          avatar: this.teamContactAccount.team.avatar,
          banner: this.teamContactAccount.team.banner,
        },
        contact: {
          name: this.teamContactAccount.contact.name,
          icon: this.teamContactAccount.contact.icon,
        },
        previousLink: this.meta.previousLink,
        previousPseudo: this.meta.previousPseudo,
        link: this.teamContactAccount.link,
        pseudo: this.teamContactAccount.pseudo,
      },
    };
  }
}
