/* eslint-disable no-await-in-loop */
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import type { ISubscribersDefine } from '@novu/node';
import { Novu } from '@novu/node';
import type { User } from '../../../users/user.entity';
import { config } from '../../configs/config';
import type { Notification } from './notifications/base.notification';

@Injectable()
export class NotificationsService {
  private readonly novu?: Novu;

  constructor(
    private readonly em: EntityManager,
  ) {
    if (config.get('novu.enabled'))
      this.novu = new Novu(config.get('novu.apiKey'));
  }

  public async trigger(...rawNotifications: Array<Notification | Promise<Notification[]>>): Promise<void> {
    if (!config.get('novu.enabled'))
      return;

    const awaitedNotifications = await Promise.all(rawNotifications);
    const notifications = awaitedNotifications.flat().map((notification) => {
      notification.attachEntityManager(this.em);
      return notification;
    });

    for (const notification of notifications) {
      const notifiees = await notification.getNotifiees();

      if (notification.batchable) {
        console.log(`DEBUG SENDING ${notification.type} to every user`);
        await this.novu!.trigger(notification.type, {
          payload: notification.getPayload(),
          to: notifiees.map(user => this.toRecipient(user)),
        });
      } else {
        for (const user of notifiees) {
          console.log(`DEBUG SENDING ${notification.type} to ${user.email}`);
          await this.novu!.trigger(notification.type, {
            payload: notification.getPayload(user),
            to: this.toRecipient(user),
          });
        }
      }

      console.log('\n\n');
    }
  }

  private toRecipient(user: User): ISubscribersDefine {
    return {
      subscriberId: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      // eslint-disable-next-line no-undefined
      avatar: user.avatar ?? undefined,
    };
  }
}
