import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { BadgeUnlock } from './entities/badge-unlock.entity';
import { Badge } from './entities/badge.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Badge, BadgeUnlock])],
  controllers: [BadgesController],
  providers: [CaslAbilityFactory, BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
