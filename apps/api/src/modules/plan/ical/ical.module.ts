import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import { User } from '@modules/uua/users/user.entity';
import { Event } from '../events/event.entity';
import { TeamICalController } from './ical.controller';
import { TeamICalService } from './ical.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Event, EventRegistration, User]),
  ],
  controllers: [TeamICalController],
  providers: [TeamICalService],
  exports: [TeamICalService],
})
export class TeamICalModule {}
