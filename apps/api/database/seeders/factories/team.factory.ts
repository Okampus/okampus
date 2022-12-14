import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { TeamKind } from '../../../src/common/lib/types/enums/team-kind.enum';
import { randomEnum } from '../../../src/common/lib/utils/random-enum';
import { slugify } from '../../../src/common/lib/utils/slugify';
import { Team } from '../../../src/modules/org/teams/team.entity';
import type { Tenant } from '../../../src/modules/org/tenants/tenant.entity';

export class TeamFactory extends Factory<Team> {
  public static lastId = 0;

  tenant: Tenant;
  model = Team;

  constructor(em: EntityManager, tenant: Tenant) {
    super(em);
    this.tenant = tenant;
  }

  public definition(faker: Faker): Partial<Team> {
    const name = faker.company.name();
    return {
      name,
      id: TeamFactory.lastId++,
      tenant: this.tenant,
      kind: randomEnum(TeamKind),
      category: faker.random.word(),
      email: `${slugify(name)}@${this.tenant.slug}.fr`,
      status: faker.lorem.sentence(),
    };
  }
}
