import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { Class } from '@modules/org/classes/class.entity';
import { Team } from '@modules/org/teams/team.entity';
import { Label } from './label.entity';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, Label, Class]),
  ],
  controllers: [LabelsController],
  providers: [CaslAbilityFactory, LabelsService],
  exports: [LabelsService],
})
export class TeamLabelsModule {}
