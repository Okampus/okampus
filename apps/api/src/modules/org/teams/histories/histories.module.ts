import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { Class } from '../../classes/class.entity';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';
import { TeamHistory } from './team-history.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamHistory, Class]),
  ],
  controllers: [HistoriesController],
  providers: [CaslAbilityFactory, HistoriesService],
  exports: [HistoriesService],
})
export class TeamHistoriesModule {}
