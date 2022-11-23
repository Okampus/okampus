import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { Team } from '@modules/org/teams/team.entity';
import { TeamFormsController } from './forms.controller';
import { FormsResolver } from './forms.resolver';
import { TeamFormsService } from './forms.service';
import { TeamForm } from './team-form.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamForm]),
    NotificationsModule,
  ],
  controllers: [TeamFormsController],
  providers: [CaslAbilityFactory, TeamFormsService, FormsResolver],
  exports: [TeamFormsService],
})
export class TeamFormsModule {}
