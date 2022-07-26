import type { ITriggerPayload } from '@novu/node';
import type { Report } from '../../../../reports/report.entity';
import type { User } from '../../../../users/user.entity';
import { computedConfig } from '../../../configs/config';
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

  public async getNotifiees(): Promise<User[]> {
    if (!this.entityManager)
      throw new TypeError('Entity Manager not attached');

    const admins = await this.getAdmins(this.settingName);
    return this.filter(admins);
  }

  public getPayload(): ITriggerPayload {
    return {
      report: {
        user: this.userToPayload(this.report.user),
        target: this.userToPayload(this.report.target),
        content: {
          body: this.report.content.body,
          date: this.report.content.createdAt,
          reportCount: this.report.content.reportCount,
        },
        contentMaster: {
          title: this.report.contentMaster!.title,
          url: `${computedConfig.frontendUrl}/forum/post/${this.report.contentMaster!.id}`,
        },
        // eslint-disable-next-line no-undefined
        reason: this.report.reason ?? undefined,
      },
    };
  }
}
