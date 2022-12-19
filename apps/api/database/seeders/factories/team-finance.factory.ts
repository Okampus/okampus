import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { PaymentMethod } from '@common/lib/types/enums/payment-method.enum';
import { TeamFinanceCategory } from '@common/lib/types/enums/team-finance-category.enum';
import { TeamFinanceState } from '@common/lib/types/enums/team-finance-type.enum';
import { TeamRole } from '@common/lib/types/enums/team-role.enum';
import { randomFromArray } from '@common/lib/utils/array-utils';
import { randomEnum } from '@lib/utils/random-enum';
import { TeamFinance } from '@modules/org/teams/finances/team-finance.entity';
import type { TeamMember } from '@modules/org/teams/members/team-member.entity';
import type { Team } from '@modules/org/teams/team.entity';
import type { Event } from '@modules/plan/events/event.entity';
import type { EventRegistration } from '@modules/plan/registrations/registration.entity';

export class TeamFinanceFactory extends Factory<TeamFinance> {
  public static lastId = 0;

  team: Team;
  events: Event[];
  teamMembers: TeamMember[];
  eventRegistrations: Record<number, EventRegistration[]>;
  model = TeamFinance;

  constructor(
    em: EntityManager,
    team: Team,
    events: Event[],
    teamMembers: TeamMember[],
    eventRegistrations: Record<number, EventRegistration[]>,
  ) {
    super(em);
    this.team = team;
    this.events = events;
    this.teamMembers = teamMembers;
    this.eventRegistrations = eventRegistrations;
  }

  public definition(faker: Faker): Partial<TeamFinance> {
    const event = (Math.random() < 0.2) ? null : randomFromArray(this.events, 1)[0];
    return {
      id: TeamFinanceFactory.lastId++,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      amount: Math.round((Math.random() - 0.5) * 100_000) / 100,
      category: randomEnum(TeamFinanceCategory),
      event,
      createdBy: randomFromArray(this.teamMembers.filter(m =>
        [TeamRole.Treasurer, TeamRole.Coowner, TeamRole.Owner, TeamRole.Manager].includes(m.role)), 1)[0].user,
      dueTo: event ? randomFromArray(this.eventRegistrations[event.id], 1)[0].user : null,
      method: randomEnum(PaymentMethod),
      team: this.team,
      state: randomEnum(TeamFinanceState),
      receipt: null,
    };
  }
}
