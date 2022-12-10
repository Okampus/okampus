import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { BadgeUnlock } from '@uaa/badges/entities/badge-unlock.entity';
import { Badge } from '@uaa/badges/entities/badge.entity';
import { User } from '@uaa/users/user.entity';
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
