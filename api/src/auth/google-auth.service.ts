import { Injectable } from '@nestjs/common';
import type { oauth2_v2 as oauth2v2 } from 'googleapis';
import { google } from 'googleapis';

@Injectable()
export class GoogleAuthService {
  public async getUser(accessToken: string): Promise<oauth2v2.Schema$Userinfo> {
    const client = new google.auth.OAuth2('1234567890', 'secret');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client.setCredentials({ access_token: accessToken });

    const oauth2 = google.oauth2({
      auth: client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();
    return data;
  }
}
