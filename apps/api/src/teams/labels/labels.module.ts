import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SchoolGroup } from '../../school-group/school-group.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { Team } from '../teams/team.entity';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';
import { TeamLabel } from './team-label.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamLabel, SchoolGroup]),
  ],
  controllers: [LabelsController],
  providers: [CaslAbilityFactory, LabelsService],
  exports: [LabelsService],
})
export class TeamLabelsModule {}
