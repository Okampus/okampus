import { Factory } from '@mikro-orm/seeder';
import { ContentMasterType, ControlType, EventState, FormType } from '@okampus/shared/enums';
import { pickOneFromArray, toSlug } from '@okampus/shared/utils';
import { ActorAddress, Content, ContentMaster, Event, Form } from '@okampus/api/dal';
import { Countries } from '@okampus/shared/consts';
import { faker } from '@faker-js/faker/locale/fr';
import { randomInt } from 'node:crypto';

import type { EntityManager } from '@mikro-orm/core';
import type { Team, Project, EventApprovalStep, TeamMember, EventOptions } from '@okampus/api/dal';

export class EventSeeder extends Factory<Event> {
  model = Event;

  constructor(
    em: EntityManager,
    private readonly team: Team,
    private readonly project: Project,
    private readonly steps: EventApprovalStep[],
    private readonly teamMembers: TeamMember[]
  ) {
    super(em);
  }

  public definition(): EventOptions {
    const start = faker.date.between(new Date('2023-04-01'), new Date('2023-07-31'));
    const end = new Date(start.getTime() + 1000 * 60 * 60 * (randomInt(2, 96) / 2));

    const submitted = Math.random() > 0.5;

    let state = EventState.Draft;
    let step: EventApprovalStep | undefined;

    if (submitted) {
      step = this.steps[randomInt(0, this.steps.length - 1)];
      state =
        step === this.steps.at(-1)
          ? Math.random() > 0.5
            ? EventState.Approved
            : EventState.Published
          : Math.random() > 0.2
          ? EventState.Rejected
          : EventState.Submitted;
    }

    const supervisor = pickOneFromArray(this.teamMembers).user;
    const name = faker.commerce.productName();

    const isPayedEvent = Math.random() > 0.5;

    return {
      contentMaster: new ContentMaster({
        type: ContentMasterType.Event,
        name,
        rootContent: new Content({
          teams: [this.team],
          text: faker.lorem.paragraphs(3),
          tenant: this.team.tenant,
          createdBy: supervisor.individual,
        }),
        slug: toSlug(name),
        tenant: this.team.tenant,
        createdBy: supervisor.individual,
      }),
      start,
      end,
      budget: Math.random() > 0.5 ? Math.round((this.project.expectedBudget / 4 + randomInt(0, 100)) * 10) / 10 : null,
      presenceReward: [0.25, 1][randomInt(2)],
      price: isPayedEvent ? randomInt(1, 50) : 0,
      project: this.project,
      address: new ActorAddress({
        actor: this.team.actor,
        city: faker.address.city(),
        country: Countries.France,
        latitude: Number.parseFloat(faker.address.latitude()),
        longitude: Number.parseFloat(faker.address.longitude()),
        state: faker.address.state(),
        street: faker.address.streetAddress(),
        zip: faker.address.zipCode(),
        name: faker.company.name(),
        createdBy: null,
        tenant: this.team.tenant,
      }),
      supervisor,
      state,
      lastEventApprovalStep: step,
      joinForm: isPayedEvent
        ? new Form({
            isTemplate: false,
            name: `Rejoindre ${name}`,
            schema: [
              {
                type: ControlType.Checkbox,
                name: 'isPayed',
                label:
                  "Avez-vous payé votre billet via le lien dans la description de l'événement ? Votre inscription ne pourra pas être validée sinon.",
                isRequired: true,
              },
            ],
            type: FormType.Event,
            undeletable: true,
            createdBy: supervisor.individual,
            tenant: this.team.tenant,
          })
        : null,
      createdBy: supervisor.individual,
      tenant: this.team.tenant,
    };
  }
}
