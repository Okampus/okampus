import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ICalCalendar, ICalCalendarMethod, ICalEvent } from 'ical-generator';
import { config } from '@common/configs/config';
import { iCals } from '@common/configs/strings';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import { User } from '@modules/uua/users/user.entity';
import { Event } from '../events/event.entity';

@Injectable()
export class TeamICalService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: BaseRepository<Event>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: BaseRepository<EventRegistration>,
  ) {}

  public async getAllPublicEventsCalendar(): Promise<ICalCalendar> {
    const events = await this.eventRepository.find({ private: false });

    const calendar = this.getCalendarFromEvents(events);
    calendar.name(iCals.globalName);

    return calendar;
  }

  public async getPersonnalCalendar(id: string): Promise<ICalCalendar> {
    const user = await this.userRepository.findOneOrFail({ eventIcal: id });

    const registrations = await this.eventRegistrationRepository.find({ user });
    const eventIds = registrations.map(registration => registration.event.id);
    const events = await this.eventRepository.find({ id: { $in: eventIds } });

    const calendar = this.getCalendarFromEvents(events);
    calendar.name(iCals.personnalName.replace('{0}', user.getFullName()));

    return calendar;
  }

  private getCalendarFromEvents(events: Event[]): ICalCalendar {
    const calendar = new ICalCalendar({
      prodId: {
        company: 'Okampus',
        product: config.baseTenant.id,
        language: 'fr',
      },
      method: ICalCalendarMethod.PUBLISH,
    });

    const calEvents: ICalEvent[] = events.map(event => new ICalEvent({
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

    calendar.events(calEvents);

    return calendar;
  }
}