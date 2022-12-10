import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Class } from '@classes/class.entity';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
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
