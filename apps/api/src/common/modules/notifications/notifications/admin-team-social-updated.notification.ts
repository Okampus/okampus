import type { ITriggerPayload } from '@novu/node';
import { Social } from '@modules/org/teams/socials/social.entity';
import type { User } from '@modules/uaa/users/user.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminTeamSocialUpdatedNotification extends Notification {
  public readonly type = NotificationType.AdminTeamContactUpdated;
  public readonly settingName = 'notificationAdminTeamSocialUpdated';
  public readonly batchable = true;

  constructor(
    private readonly social: Social,
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
    await this.entityManager.getRepository(Social).populate(
      this.social,
      ['team'],
    );
  }

  public getPayload(): ITriggerPayload {
    if (this.social.team) {
      return {
        executor: this.userToPayload(this.meta.executor),
        teamContactAccount: {
          id: this.social.id,
          team: {
            id: this.social.team.id,
            name: this.social.team.name,
            shortDescription: this.social.team.shortDescription,
            category: this.social.team.category,
            labels: this.social.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
            logo: this.social.team.logo,
            logoDark: this.social.team.logoDark,
            banner: this.social.team.banner,
          },
          contact: this.social.socialType,
          previousLink: this.meta.previousLink,
          previousPseudo: this.meta.previousPseudo,
          link: this.social.link,
          pseudo: this.social.pseudo,
        },
      };
    }
    return {
      executor: this.userToPayload(this.meta.executor),
    };
  }
}
