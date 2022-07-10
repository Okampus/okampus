import { Injectable } from '@nestjs/common';
import type { TriggerRecipientsType } from '@novu/node';
import { Novu } from '@novu/node';
import type { Content } from '../../../contents/entities/content.entity';
import type { User } from '../../../users/user.entity';
import { config } from '../../configs/config';

@Injectable()
export class MailService {
  private readonly novu?: Novu;

  constructor() {
    if (config.get('novu.enabled'))
      this.novu = new Novu(config.get('novu.apiKey'));
  }

  public async newThreadContent(content: Content): Promise<void> {
    if (!config.get('novu.enabled'))
      return;

    const participants = content.contentMaster.participants.isInitialized()
      ? content.contentMaster.participants.getItems()
      : await content.contentMaster.participants.loadItems();

    for (const participant of participants) {
      if (participant.email === content.author.email)
        continue;

      // eslint-disable-next-line no-await-in-loop
      await this.novu!.trigger('new-thread-content', {
        payload: {
          firstname: participant.firstname,
          author: content.author.getFullName(),
          threadTitle: content.contentMaster.title,
          message: content.body,
          threadUrl: `${config.get('baseUrl')}/forum/post/${content.contentMasterId}`,
        },
        to: this.toRecipient(participant),
      });
    }
  }

  private toRecipient(user: User): TriggerRecipientsType {
    return {
      subscriberId: user.userId,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
    };
  }
}
