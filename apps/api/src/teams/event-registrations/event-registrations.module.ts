import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamEvent } from '../events/team-event.entity';
import { TeamForm } from '../forms/team-form.entity';
import { TeamMember } from '../members/team-member.entity';
import { TeamEventRegistrationsController } from './event-registrations.controller';
import { TeamEventRegistrationsResolver } from './event-registrations.resolver';
import { TeamEventRegistrationsService } from './event-registrations.service';
import { TeamEventRegistration } from './team-event-registration.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamMember, TeamEvent, TeamForm, TeamEventRegistration]),
  ],
  controllers: [TeamEventRegistrationsController],
  providers: [CaslAbilityFactory, TeamEventRegistrationsService, TeamEventRegistrationsResolver],
  exports: [TeamEventRegistrationsService],
})
export class TeamEventRegistrationsModule {}
