import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { EventState } from '@okampus/shared/enums';
import { pickOneFromArray } from '@okampus/shared/utils';
import { randomInt } from 'node:crypto';
import { TenantEvent } from '../../../resources/content-master/event/event.entity';
import { TenantEventOptions } from '../../../resources/content-master/event/event.options';
import { EventApprovalStep } from '../../../resources/manage-tenant/event-approval-step/event-approval-step.entity';
import { TeamMember } from '../../../resources/membership/team-member/team-member.entity';
import { Team } from '../../../resources/org/team/team.entity';
import { Address } from '@okampus/shared/dtos';

export class EventSeeder extends Factory<TenantEvent> {
  team: Team;
  steps: EventApprovalStep[];
  teamMembers: TeamMember[];
  model = TenantEvent;

  constructor(em: EntityManager, team: Team, steps: EventApprovalStep[], teamMembers: TeamMember[]) {
    super(em);
    this.team = team;
    this.steps = steps;
    this.teamMembers = teamMembers;
  }

  public definition(faker: Faker): TenantEventOptions {
    const start = faker.date.future();
    const end = new Date(start.getDate() + 1000 * 60 * 60 * (randomInt(2, 96) / 2));

    const submitted = Math.random() > 0.5;

    let state = Math.random() > 0.5 ? EventState.Template : EventState.Draft;
    let step: EventApprovalStep | undefined;

    if (submitted) {
      step = this.steps[randomInt(0, this.steps.length - 1)];
      state =
        step === this.steps[this.steps.length - 1]
          ? EventState.Published
          : Math.random() > 0.2
          ? EventState.Rejected
          : EventState.Submitted;
    }

    const user = pickOneFromArray(this.teamMembers.filter((m) => m.roles.getItems().some((r) => r.canManage()))).user;

    return {
      description: faker.lorem.paragraphs(3),
      tenant: this.team.tenant,
      title: faker.lorem.words(randomInt(3, 10)),
      start,
      end,
      price: randomInt(0, 100),
      location: new Address({
        name: faker.lorem.words(randomInt(3, 10)),
        street: faker.address.streetAddress(),
        city: faker.address.city(),
      }),
      supervisor: user,
      state,
      lastEventApprovalStep: step,
      createdBy: user,
    };
  }
}
