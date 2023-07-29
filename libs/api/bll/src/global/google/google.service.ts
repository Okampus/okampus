import { loadConfig } from '../../shards/utils/load-config';

import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

import axios from 'axios';

import type { ApiConfig } from '@okampus/shared/types';

const cx = '74e7e0f37a7c14367';

@Injectable()
export class GoogleService {
  googleSearchApiToken: string;
  logger = new Logger(GoogleService.name);

  constructor(private readonly configService: ConfigService) {
    this.googleSearchApiToken = loadConfig<ApiConfig['google']>(this.configService, 'google').customSearchApiKey;
  }

  public async getFirstResultLink(query: string): Promise<string> {
    const { data } = await axios.get(
      `https://www.googleapis.com/customsearch/v1?key=${this.googleSearchApiToken}&q=${query}&cx=${cx}&lr=fr&num=1`
    );

    return data.items[0].link;
  }
}
