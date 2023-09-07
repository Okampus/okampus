import { Tag } from '@okampus/api/dal';
import { TagType } from '@okampus/shared/enums';

import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker/locale/fr';

import type { Tenant, TagOptions } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export class TagSeeder extends Factory<Tag> {
  model = Tag;

  constructor(
    em: EntityManager,
    private readonly tenant: Tenant,
  ) {
    super(em);
  }

  public definition(): TagOptions {
    const name = faker.word.noun();

    return {
      name,
      type: TagType.Tag,
      createdBy: null,
      tenantScope: this.tenant,
    };
  }
}
