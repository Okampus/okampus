import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Event } from '@plan/events/event.entity';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';
import { TeamFile } from '@upload/team-files/team-file.entity';
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
