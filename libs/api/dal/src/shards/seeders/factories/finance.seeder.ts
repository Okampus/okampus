import { Finance } from '../../../resources/manage-team/finance/finance.entity';
import { Factory } from '@mikro-orm/seeder';
import { FinanceCategory, FinanceState, PaymentMethod } from '@okampus/shared/enums';
import { pickOneFromArray, randomEnum } from '@okampus/shared/utils';
import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import type { TenantEvent } from '../../../resources/content-master/event/event.entity';
import type { EventJoin } from '../../../resources/join/event-join/event-join.entity';
import type { FinanceOptions } from '../../../resources/manage-team/finance/finance.options';
import type { TeamMember } from '../../../resources/membership/team-member/team-member.entity';
import type { Team } from '../../../resources/org/team/team.entity';

export class TeamFinanceSeeder extends Factory<Finance> {
  team: Team;
  events: TenantEvent[];
  teamMembers: TeamMember[];
  eventRegistrations: Record<number, EventJoin[]>;
  model = Finance;

  constructor(
    em: EntityManager,
    team: Team,
    events: TenantEvent[],
    teamMembers: TeamMember[],
    eventRegistrations: Record<number, EventJoin[]>
  ) {
    super(em);
    this.team = team;
    this.events = events;
    this.teamMembers = teamMembers;
    this.eventRegistrations = eventRegistrations;
  }

  public definition(faker: Faker): FinanceOptions {
    const linkedEvent = Math.random() < 0.8 ? pickOneFromArray(this.events) : undefined;
    const amount = +faker.finance.amount();

    return {
      transaction: faker.finance.transactionDescription(),
      description: faker.lorem.sentence(),
      paymentDate: faker.date.future(),
      address: null,
      amountDue: amount,
      amountPayed: amount,
      paymentMethod: randomEnum(PaymentMethod),
      state: randomEnum(FinanceState),
      category: randomEnum(FinanceCategory),
      linkedEvent,
      team: this.team,
      createdBy: pickOneFromArray(this.teamMembers.filter((m) => m.roles.getItems().some((r) => r.isDirector()))).user,
      tenant: this.team.tenant,
    };
  }
}
