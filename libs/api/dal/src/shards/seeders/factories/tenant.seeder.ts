import { TenantCore } from '../../../resources/org/tenant/tenant-core.entity';
import { Tenant } from '../../../resources/org/tenant/tenant.entity';
import { Factory } from '@mikro-orm/seeder';
import { toSlug } from '@okampus/shared/utils';
import type { Faker } from '@mikro-orm/seeder';
import type { TenantOptions } from '../../../resources/org/tenant/tenant.options';

export class TenantSeeder extends Factory<Tenant> {
  model = Tenant;

  public definition(faker: Faker): TenantOptions {
    const name = faker.company.name();
    return {
      name,
      slug: toSlug(name),
      tenant: new TenantCore({ name, domain: `${toSlug(name)}.fr` }),
    };
  }
}
