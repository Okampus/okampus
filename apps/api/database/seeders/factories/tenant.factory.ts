import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { slugify } from '@lib/utils/slugify';
import { Tenant } from '@org/tenants/tenant.entity';

export class TenantFactory extends Factory<Tenant> {
  public static lastId = 0;

  model = Tenant;

  public definition(faker: Faker): Partial<Tenant> {
    const name = faker.company.name();
    return {
      name,
      slug: slugify(name),
      eventApprovalForm: [],
    };
  }
}
