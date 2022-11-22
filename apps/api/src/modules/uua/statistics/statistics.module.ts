import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { NotificationsModule } from '@meta/shared/modules/notifications/notifications.module';
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import { Badge } from '../badges/entities/badge.entity';
import { User } from '../users/user.entity';
import { Statistics } from './statistics.entity';
import { StatisticsListener } from './statistics.listener';
import { StatisticsService } from './statistics.service';
import { ContentSubscriber } from './subscribers/content.subscriber';
import { DocumentSubscriber } from './subscribers/document.subscriber';

@Module({
  imports: [
    MikroOrmModule.forFeature([Statistics, User, Badge, BadgeUnlock]),
    NotificationsModule,
  ],
  controllers: [],
  providers: [
    StatisticsService,
    StatisticsListener,
    ContentSubscriber,
    DocumentSubscriber,
  ],
  exports: [StatisticsService],
})
export class StatisticsModule {}
