import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Team } from '@modules/org/teams/team.entity';
import { Event } from '@modules/plan/events/event.entity';
import { User } from '@modules/uaa/users/user.entity';
import { TeamFile } from '@modules/upload/team-files/team-file.entity';
import { TeamFinancesController } from './finances.controller';
import { TeamFinancesResolver } from './finances.resolver';
import { TeamFinancesService } from './finances.service';
import { TeamFinance } from './team-finance.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, Event, TeamFile, TeamFinance, User]),
  ],
  controllers: [TeamFinancesController],
  providers: [CaslAbilityFactory, TeamFinancesService, TeamFinancesResolver],
  exports: [TeamFinancesService],
})
export class TeamFinancesModule {}
