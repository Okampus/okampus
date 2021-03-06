import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { Team } from '../teams/team.entity';
import { TeamFormsController } from './forms.controller';
import { TeamFormsService } from './forms.service';
import { TeamForm } from './team-form.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamForm]),
  ],
  controllers: [TeamFormsController],
  providers: [CaslAbilityFactory, TeamFormsService],
  exports: [TeamFormsService],
})
export class TeamFormsModule {}
