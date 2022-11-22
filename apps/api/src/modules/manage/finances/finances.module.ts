import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { Team } from '@modules/org/teams/team.entity';
import { TeamEvent } from '@modules/plan/events/team-event.entity';
import { TeamFile } from '@modules/store/team-files/team-file.entity';
import { User } from '@modules/uua/users/user.entity';
import { TeamFinancesController } from './finances.controller';
import { TeamFinancesResolver } from './finances.resolver';
import { TeamFinancesService } from './finances.service';
import { TeamFinance } from './team-finance.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamEvent, TeamFile, TeamFinance, User]),
  ],
  controllers: [TeamFinancesController],
  providers: [CaslAbilityFactory, TeamFinancesService, TeamFinancesResolver],
  exports: [TeamFinancesService],
})
export class TeamFinancesModule {}
