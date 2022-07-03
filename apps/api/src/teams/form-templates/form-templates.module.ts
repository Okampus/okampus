import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { Team } from '../teams/team.entity';
import { TeamFormTemplatesController } from './form-templates.controller';
import { TeamFormTemplatesService } from './form-templates.service';
import { TeamFormTemplate } from './team-form-template.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamFormTemplate]),
  ],
  controllers: [TeamFormTemplatesController],
  providers: [CaslAbilityFactory, TeamFormTemplatesService],
  exports: [TeamFormTemplatesService],
})
export class TeamFormTemplatesModule {}
