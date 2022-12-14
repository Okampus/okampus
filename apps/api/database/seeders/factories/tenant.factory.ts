import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { _slugify } from '../../../src/common/lib/utils/slugify';
import { Tenant } from '../../../src/modules/org/tenants/tenant.entity';

export class TenantFactory extends Factory<Tenant> {
  public static lastId = 0;

  model = Tenant;

  public definition(faker: Faker): Partial<Tenant> {
    const name = faker.company.name();
    return {
      name,
      slug: _slugify(name),
      eventApprovalForm: [],
    };
  }
}
