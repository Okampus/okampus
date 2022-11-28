import type { ITriggerPayload } from '@novu/node';
import type { User } from '@modules/uaa/users/user.entity';
import { TeamFile } from '@modules/upload/team-files/team-file.entity';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminTeamLegalFileUpdatedNotification extends Notification {
  public readonly type = NotificationType.AdminTeamLegalFileUpdated;
  public readonly settingName = 'notificationAdminTeamLegalFileUpdated';
  public readonly batchable = true;

  constructor(
    private readonly teamFile: TeamFile,
    private readonly meta: { executor: User },
  ) {
    super();
    this.excludedEmails.push(this.meta.executor.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const clubManagers = await this.getClubManagers(this.settingName);
    return this.filter(clubManagers);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(TeamFile).populate(
      this.teamFile,
      ['team', 'file'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      executor: this.userToPayload(this.meta.executor),
      teamFile: {
        id: this.teamFile.id,
        team: {
          id: this.teamFile.team.id,
          name: this.teamFile.team.name,
          shortDescription: this.teamFile.team.shortDescription,
          category: this.teamFile.team.category,
          labels: this.teamFile.team.labels.getItems().map(label => ({ name: label.name, type: label.type })),
          logo: this.teamFile.team.logo,
          logoDark: this.teamFile.team.logoDark,
          banner: this.teamFile.team.banner,
        },
        file: {
          id: this.teamFile.file.id,
          name: this.teamFile.file.name,
          fileSize: this.teamFile.file.size,
          mimeType: this.teamFile.file.mimeType,
          url: this.teamFile.file.url,
          fileKind: this.teamFile.file.kind,
        },
        type: this.teamFile.type,
        description: this.teamFile.description,
      },
    };
  }
}
