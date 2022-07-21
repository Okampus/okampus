import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamFile } from '../../files/team-files/team-file.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import { Team } from '../teams/team.entity';
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
