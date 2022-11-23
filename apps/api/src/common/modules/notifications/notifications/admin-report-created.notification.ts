import type { ITriggerPayload } from '@novu/node';
import { Report } from '@modules/interact/reports/report.entity';
import type { User } from '@modules/uua/users/user.entity';
import { config } from '../../../configs/config';
import { NotificationType } from '../notification-type.enum';
import { Notification } from './base.notification';

export class AdminReportCreatedNotification extends Notification {
  public readonly type = NotificationType.AdminReportCreated;
  public readonly settingName = 'notificationAdminReportCreated';
  public readonly batchable = true;

  constructor(
    private readonly report: Report,
  ) {
    super();
    this.excludedEmails.push(this.report.user.email);
  }

  public async getNotifiees(): Promise<Set<User>> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const admins = await this.getAdmins(this.settingName);
    return this.filter(admins);
  }

  public async ensurePayload(): Promise<void> {
    await this.entityManager.getRepository(Report).populate(
      this.report,
      ['content', 'contentMaster', 'user', 'target'],
    );
  }

  public getPayload(): ITriggerPayload {
    return {
      report: {
        user: this.userToPayload(this.report.user),
        target: this.userToPayload(this.report.target),
        content: {
          body: this.report.content.body,
          date: this.report.content.createdAt,
          isAnonymous: this.report.content.isAnonymous,
          upvoteCount: this.report.content.upvoteCount,
          downvoteCount: this.report.content.downvoteCount,
          totalVoteCount: this.report.content.totalVoteCount,
          hidden: this.report.content.hidden,
          isVisible: this.report.content.isVisible,
          reportCount: this.report.content.reportCount,
        },
        contentMaster: {
          title: this.report.contentMaster?.title ?? 'titre',
          url: `${config.network.frontendUrl}/forum/post/${this.report.contentMaster!.id}`,
        },
        // eslint-disable-next-line no-undefined
        reason: this.report.reason ?? undefined,
      },
    };
  }
}
