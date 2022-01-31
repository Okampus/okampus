import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BadgeUnlock } from '../badges/badge-unlock.entity';
import { Badge } from '../badges/badge.entity';
import { User } from '../users/user.entity';
import { Statistics } from './statistics.entity';
import { StatisticsListener } from './statistics.listener';
import { StatisticsService } from './statistics.service';
import { ContentSubscriber } from './subscribers/content.subscriber';
import { DocumentSubscriber } from './subscribers/document.subscriber';

@Module({
  imports: [
    MikroOrmModule.forFeature([Statistics, User, Badge, BadgeUnlock]),
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
