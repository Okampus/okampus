import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SchoolGroup } from '../../school-group/school-group.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';
import { TeamHistory } from './history.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamHistory, SchoolGroup]),
  ],
  controllers: [HistoriesController],
  providers: [CaslAbilityFactory, HistoriesService],
  exports: [HistoriesService],
})
export class TeamHistoriesModule {}
