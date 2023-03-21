import { Team } from '../../../resources/org/team/team.entity';
import { Factory } from '@mikro-orm/seeder';
import { TeamType } from '@okampus/shared/enums';
import { randomFromArray, randomInt, toSlug } from '@okampus/shared/utils';

import type { Tag } from '../../../resources/label/tag/tag.entity';
import type { TeamCategory } from '../../../resources/label/team-category/team-category.entity';
import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import type { TeamOptions } from '../../../resources/org/team/team.options';
import type { Tenant } from '../../../resources/org/tenant/tenant.entity';

export class TeamSeeder extends Factory<Team> {
  model = Team;

  constructor(
    em: EntityManager,
    private readonly tenant: Tenant,
    private readonly categories: TeamCategory[],
    private readonly tags: Tag[]
  ) {
    super(em);
  }

  public definition(faker: Faker): Omit<TeamOptions, 'joinForm'> {
    const name = faker.company.name();

    return {
      name,
      bio: faker.lorem.paragraph(randomInt(2, 12)),
      categories: randomFromArray(this.categories, 1, 3),
      currentFinance: 0,
      primaryEmail: `${toSlug(name)}@${this.tenant.tenant.domain}.fr`,
      slug: toSlug(name),
      tagline: faker.company.catchPhrase(),
      tags: randomFromArray(this.tags, 2, 10),
      type: TeamType.Club,
      createdBy: null,
      tenant: this.tenant.tenant,
    };
  }
}
