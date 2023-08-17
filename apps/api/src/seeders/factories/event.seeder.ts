import { generateRandomSubmission } from './submission.seeder';
import { Address, Content, Event, Form, FormSubmission, Location } from '@okampus/api/dal';
import { Countries } from '@okampus/shared/consts';
import { ControlType, EventState, FormType, LocationType } from '@okampus/shared/enums';
import { getRoundedDate, pickOneFromArray, randomId, toSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker/locale/fr';
import { Factory } from '@mikro-orm/seeder';
import { randomInt } from 'node:crypto';

import type { Team, EventApprovalStep, TeamMember, EventOptions } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';
import type { FormSchema } from '@okampus/shared/types';

export class EventSeeder extends Factory<Event> {
  model = Event;

  constructor(
    em: EntityManager,
    private readonly team: Team,
    private readonly steps: EventApprovalStep[],
    private readonly teamMembers: TeamMember[],
  ) {
    super(em);
  }

  public definition(): EventOptions {
    const start = getRoundedDate(30, faker.date.between({ from: new Date('2022-09-01'), to: new Date('2024-09-01') }));
    const end = new Date(start.getTime() + 1000 * 60 * 60 * randomInt(1, 48));

    const submitted = Math.random() > 0.5;

    let state = EventState.Draft;
    let step: EventApprovalStep | null = null;

    if (submitted) {
      if (Math.random() > 0.25) {
        state = Math.random() > 0.25 ? EventState.Published : EventState.Approved;
      } else {
        step = this.steps[randomInt(0, this.steps.length)];
        state = Math.random() > 0.5 ? EventState.Rejected : EventState.Submitted;
      }
    } else {
      step = this.steps[0];
    }

    const supervisor = pickOneFromArray(this.teamMembers).user;
    const name = faker.commerce.productName();

    const payedEvent = Math.random() > 0.5;
    const [streetNumber, ...rest] = faker.location.streetAddress().split(' ');

    const isOnline = Math.random() > 0.5;
    const location = isOnline
      ? new Location({
          type: LocationType.Online,
          onlineLink: faker.internet.url(),
          locationDetails: faker.lorem.paragraphs(1),
          actor: this.team.actor,
          createdBy: null,
          address: null,
          tenant: this.team.tenant,
        })
      : new Location({
          type: LocationType.Address,
          actor: this.team.actor,
          createdBy: null,
          tenant: this.team.tenant,
          address: new Address({
            city: faker.location.city(),
            country: Countries.France,
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            state: faker.location.state(),
            streetNumber,
            street: rest.join(' '),
            zip: faker.location.zipCode(),
          }),
        });

    const eventApprovalSubmission =
      !isOnline && this.team.tenant.eventValidationForm
        ? new FormSubmission({
            form: this.team.tenant.eventValidationForm,
            submission: generateRandomSubmission(this.team.tenant.eventValidationForm.schema as FormSchema),
            createdBy: supervisor.individual,
            tenant: this.team.tenant,
          })
        : null;

    return {
      name,
      content: new Content({
        team: this.team,
        text: faker.lorem.paragraphs(3),
        tenant: this.team.tenant,
        createdBy: supervisor.individual,
      }),
      slug: `${toSlug(name)}-${randomId()}`,
      start,
      end,
      pointsAwardedForAttendance: [0.25, 1][randomInt(2)],
      price: payedEvent ? randomInt(1, 50) : 0,
      location,
      state,
      nextEventApprovalStep: step,
      eventApprovalSubmission,
      joinForm: payedEvent
        ? new Form({
            name: `Rejoindre ${name}`,
            schema: [
              {
                type: ControlType.Checkbox,
                name: 'payed',
                label:
                  "Avez-vous payé votre billet via le lien dans la description de l'événement ? Votre inscription ne pourra pas être validée sinon.",
                placeholder: '',
                required: true,
              },
            ],
            type: FormType.Event,
            createdBy: supervisor.individual,
            tenant: this.team.tenant,
          })
        : null,
      createdBy: supervisor.individual,
      tenant: this.team.tenant,
    };
  }
}
