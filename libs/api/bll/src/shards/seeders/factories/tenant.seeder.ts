import { Factory } from '@mikro-orm/seeder';
import { Tenant } from '@okampus/api/dal';
import { toSlug } from '@okampus/shared/utils';
import { faker } from '@faker-js/faker/locale/fr';

import type { TenantOptions } from '@okampus/api/dal';

export class TenantSeeder extends Factory<Tenant> {
  model = Tenant;

  public definition(): TenantOptions {
    const name = faker.company.name();
    return {
      domain: toSlug(name),
      pointName: 'LXP',
    };
  }
}
