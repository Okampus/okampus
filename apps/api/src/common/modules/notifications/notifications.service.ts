/* eslint-disable no-await-in-loop */
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import type { ISubscribersDefine } from '@novu/node';
import { Novu } from '@novu/node';
import type { Settings } from '@modules/uua/settings/settings.entity';
import { User } from '@modules/uua/users/user.entity';
import { config } from '../../configs/config';
import { NotificationChannel } from '../../lib/types/enums/notification-channel.enum';
import type { Notification } from './notifications/base.notification';

@Injectable()
export class NotificationsService {
  private readonly novu?: Novu;
  private readonly logger = new Logger('Notifications');

  constructor(
    private readonly em: EntityManager,
  ) {
    if (config.novu.enabled)
      this.novu = new Novu(config.novu.apiKey);
  }

  public async triggerFirst(...notifications: Notification[]): Promise<void> {
    for (let i = 0; i < notifications.length; i++) {
      notifications[i].attachEntityManager(this.em);

      if (!notifications[i].payloadEnsured) {
        await notifications[i].ensurePayload();
        notifications[i].payloadEnsured = true;
      }

      const notifiees = await notifications[i].getNotifiees();

      if (notifiees.size > 0) {
        for (let j = i + 1; j < notifications.length; j++)
          notifications[j].excludedEmails.push(...[...notifiees].map(user => user.email));
      }
    }

    await this.trigger(...notifications);
  }

  public async trigger(...notifications: Notification[]): Promise<void> {
    for (const notification of notifications) {
      notification.attachEntityManager(this.em);

      if (!notification.payloadEnsured) {
        await notification.ensurePayload();
        notification.payloadEnsured = true;
      }

      const notifiees = await notification.getNotifiees();
      const notifieesWithSettings = await this.addSettings(notifiees);
      const usersByChannels = this.groupBy(notifieesWithSettings, notification.settingName);

      if (usersByChannels.length === 0)
        continue;


      if (notification.batchable) {
        for (const [channel, users] of usersByChannels) {
          this.logger.log(`BATCH: Sending ${notification.type} (${channel}) to ${users.length} user(s) (${users.map(user => user.id).join(', ')})`);

          if (config.novu.enabled) {
            await this.novu!.trigger(`${notification.type}-${channel}`, {
              payload: notification.getPayload(),
              to: [...users].map(user => this.toRecipient(user)),
            });
          }
        }
      } else {
        for (const [channel, users] of usersByChannels) {
          this.logger.log(`INDIVIDUAL: Sending ${notification.type} (${channel}) to ${users.length} user(s) (${users.map(user => user.id).join(', ')})`);

          if (config.novu.enabled) {
            for (const user of users) {
              await this.novu!.trigger(`${notification.type}-${channel}`, {
                payload: notification.getPayload(user),
                to: this.toRecipient(user),
              });
            }
          }
        }
      }
    }
  }

  private toRecipient(user: User): ISubscribersDefine {
    return {
      subscriberId: user.id,
      firstName: user.name,
      lastName: user.lastName ?? undefined, // eslint-disable-line no-undefined
      email: user.email,
      avatar: user.avatar?.file?.url ?? undefined, // eslint-disable-line no-undefined
    };
  }

  private groupBy(notifiees: User[], settingName: keyof Settings): Array<[channel: string, users: User[]]> {
    const groups = {
      inapp: [] as User[],
      mail: [] as User[],
      push: [] as User[],
    };

    for (const user of notifiees) {
      const channel = user.settings[settingName] as number;
      if (channel & NotificationChannel.InApp)
        groups.inapp.push(user);
      if (channel & NotificationChannel.Mail)
        groups.mail.push(user);

      // TODO: Push notifications (just have to uncomment that and add them to Novu)
      // if (channel & NotificationChannel.Push)
      //   groups.push.push(user);
    }

    return Object.entries(groups).filter(([_channel, users]) => users.length > 0);
  }

  private async addSettings(users: Set<User>): Promise<User[]> {
    return await this.em.getRepository(User).populate([...users], ['settings']);
  }
}
