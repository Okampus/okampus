import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ICalCalendar, ICalCalendarMethod, ICalEvent } from 'ical-generator';
import { config } from '../../../shared/configs/config';
import { iCals } from '../../../shared/configs/strings';
import { BaseRepository } from '../../../shared/lib/orm/base.repository';
import { User } from '../../../uua/users/user.entity';
import { TeamEventRegistration } from '../event-registrations/team-event-registration.entity';
import { TeamEvent } from '../events/team-event.entity';

@Injectable()
export class TeamICalService {
  constructor(
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(TeamEventRegistration)
    private readonly teamEventRegistrationRepository: BaseRepository<TeamEventRegistration>,
  ) {}

  public async getAllPublicEventsCalendar(): Promise<ICalCalendar> {
    const events = await this.teamEventRepository.find({ private: false });

    const calendar = this.getCalendarFromEvents(events);
    calendar.name(iCals.globalName);

    return calendar;
  }

  public async getPersonnalCalendar(id: string): Promise<ICalCalendar> {
    const user = await this.userRepository.findOneOrFail({ teamEventIcal: id });

    const registrations = await this.teamEventRegistrationRepository.find({ user });
    const eventIds = registrations.map(registration => registration.event.id);
    const events = await this.teamEventRepository.find({ id: { $in: eventIds } });

    const calendar = this.getCalendarFromEvents(events);
    calendar.name(iCals.personnalName.replace('{0}', user.getFullName()));

    return calendar;
  }

  private getCalendarFromEvents(teamEvents: TeamEvent[]): ICalCalendar {
    const calendar = new ICalCalendar({
      prodId: {
        company: 'Okampus',
        product: config.baseTenant.id,
        language: 'fr',
      },
      method: ICalCalendarMethod.PUBLISH,
    });

    const events: ICalEvent[] = teamEvents.map(event => new ICalEvent({
      start: event.start,
      end: event.end,
      created: event.createdAt,
      description: event.description,
      location: event.location,
      organizer: {
        name: event.createdBy.getFullName(),
        email: event.createdBy.email,
      },
      summary: event.name,
      url: `${config.network.frontendUrl}/events/${event.id}`,
    }, calendar));

    calendar.events(events);

    return calendar;
  }
}
