import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { TeamType } from '@okampus/shared/enums';
import { toSlug } from '@okampus/shared/utils';
import { Team } from '../../../resources/org/team/team.entity';
import { TeamOptions } from '../../../resources/org/team/team.options';
import { Tenant } from '../../../resources/org/tenant/tenant.entity';

export class TeamSeeder extends Factory<Team> {
  tenant: Tenant;
  model = Team;

  constructor(em: EntityManager, tenant: Tenant) {
    super(em);
    this.tenant = tenant;
  }

  public definition(faker: Faker): TeamOptions {
    const name = faker.company.name();
    return {
      name,
      currentFinance: 0,
      slug: toSlug(name),
      type: TeamType.Club,
      tagline: faker.company.catchPhrase(),
      bio: faker.lorem.paragraph(),
      primaryEmail: `${toSlug(name)}@${this.tenant.tenant.domain}.fr`,
      tenant: this.tenant.tenant,
    };
  }
}
