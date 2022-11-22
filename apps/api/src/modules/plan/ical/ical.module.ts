import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from '@modules/uua/users/user.entity';
import { TeamEventRegistration } from '../event-registrations/team-event-registration.entity';
import { TeamEvent } from '../events/team-event.entity';
import { TeamICalController } from './ical.controller';
import { TeamICalService } from './ical.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamEvent, TeamEventRegistration, User]),
  ],
  controllers: [TeamICalController],
  providers: [TeamICalService],
  exports: [TeamICalService],
})
export class TeamICalModule {}
