import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { TeamRole } from '@common/lib/types/enums/team-role.enum';
import { randomFromArray } from '@common/lib/utils/array-utils';
import { EventState } from '@lib/types/enums/event-state.enum';
import { randomInt } from '@lib/utils/random-utils';
import type { TeamMember } from '@modules/org/teams/members/team-member.entity';
import type { Team } from '@org/teams/team.entity';
import type { ApprovalStep } from '@org/tenants/approval-steps/approval-step.entity';
import type { Tenant } from '@org/tenants/tenant.entity';
import { Event } from '@plan/events/event.entity';

export class EventFactory extends Factory<Event> {
  public static lastId = 0;

  tenant: Tenant;
  team: Team;
  steps: ApprovalStep[];
  teamMembers: TeamMember[];
  model = Event;

  constructor(em: EntityManager, team: Team, steps: ApprovalStep[], teamMembers: TeamMember[]) {
    super(em);
    this.tenant = team.tenant;
    this.team = team;
    this.steps = steps;
    this.teamMembers = teamMembers;
  }

  public definition(faker: Faker): Partial<Event> {
    const start = faker.date.future();
    const end = new Date(start.getDate() + 1000 * 60 * 60 * 2);
    const submitted = Math.random() > 0.5;
    let state = Math.random() > 0.5 ? EventState.Template : EventState.Draft;
    let step: ApprovalStep | null = null;
    if (submitted) {
      step = this.steps[randomInt(0, this.steps.length - 1)];
      state = step === this.steps[this.steps.length - 1]
        ? EventState.Published
        : Math.random() > 0.2 ? EventState.Rejected : EventState.Submitted;
    }
    // Let state = submitted ? (Math.random() > 0.5: EventState.Submitted) : EventState.Draft;

    return {
      id: EventFactory.lastId++,
      tenant: this.tenant,
      name: faker.lorem.words(3),
      createdBy: randomFromArray(this.teamMembers.filter(m =>
        [TeamRole.Treasurer, TeamRole.Coowner, TeamRole.Owner, TeamRole.Manager].includes(m.role)), 1)[0].user,
      description: faker.lorem.paragraphs(3),
      start,
      end,
      team: this.team,
      price: randomInt(0, 100),
      location: faker.address.streetAddress(),
      state,
      lastApprovalStep: step,
    };
  }
}
