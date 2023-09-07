import { RequestContext } from '../../shards/abstract/request-context';
import { loadConfig } from '../../shards/utils/load-config';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Novu } from '@novu/node';

@Injectable()
export class NotificationsService extends RequestContext {
  enabled = false;
  novu: Novu | null = null;
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async init(): Promise<void> {
    const options = loadConfig(this.configService, 'novu');
    this.novu = new Novu(options.apiKey);
    this.enabled = true;
  }

  // async trigger() {

  // }
}
