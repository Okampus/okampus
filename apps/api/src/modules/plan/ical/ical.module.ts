import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Event } from '@plan/events/event.entity';
import { EventRegistration } from '@plan/registrations/registration.entity';
import { User } from '@uaa/users/user.entity';
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
