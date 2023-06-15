import { Factory } from '@mikro-orm/seeder';
import { Team } from '@okampus/api/dal';
import { TeamType } from '@okampus/shared/enums';
import { randomFromArray, toSlug } from '@okampus/shared/utils';
import { faker } from '@faker-js/faker/locale/fr';
import { randomInt } from 'node:crypto';

import type { Tenant, TeamOptions, Tag } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export class TeamSeeder extends Factory<Team> {
  model = Team;

  constructor(em: EntityManager, private readonly tenant: Tenant, private readonly tags: Tag[]) {
    super(em);
  }

  public definition(): Omit<TeamOptions, 'joinForm'> {
    const name = faker.company.name();

    return {
      name,
      bio: faker.lorem.paragraph(randomInt(2, 12)),
      currentFinance: 0,
      primaryEmail: `${toSlug(name)}@${this.tenant.domain}.fr`,
      slug: toSlug(name),
      status: faker.company.catchPhrase(),
      tags: randomFromArray(this.tags, 2, 10),
      type: TeamType.Club,
      createdBy: null,
      tenant: this.tenant,
    };
  }
}
