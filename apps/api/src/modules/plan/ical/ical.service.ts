import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ICalCalendar, ICalCalendarMethod, ICalEvent } from 'ical-generator';
import { config } from '@configs/config';
import { iCals } from '@configs/strings';
import { GlobalRequestService } from '@lib/helpers/global-request-service';
import { BaseRepository } from '@lib/orm/base.repository';
import { Event } from '@plan/events/event.entity';
import { EventRegistration } from '@plan/registrations/registration.entity';
import { User } from '@uaa/users/user.entity';

@Injectable()
export class TeamICalService extends GlobalRequestService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: BaseRepository<Event>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: BaseRepository<EventRegistration>,
  ) { super(); }

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
        product: this.currentTenant().slug,
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
