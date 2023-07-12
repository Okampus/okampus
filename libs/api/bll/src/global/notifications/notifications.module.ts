import { NotificationsService } from './notifications.service';
import { Global, Module } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({ imports: [ConfigModule], providers: [NotificationsService], exports: [NotificationsService] })
export class NotificationsModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService
  ) {}
  public async onModuleInit(): Promise<void> {
    if (this.configService.get('novu.isEnabled')) await this.notificationsService.init();
  }
}
