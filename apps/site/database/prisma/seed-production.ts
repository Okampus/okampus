import { seedTenantLocation } from './seeders/seed-tenant-location';
import { seedCategories } from './seeders/seed-categories';
import { seedTeams } from './seeders/seed-teams';

import { s3Client } from '../../server/secrets';

import { getGoCardLessBanks } from '../../server/services/bank';
import { CountryCode } from '@prisma/client';

import type { TenantWithProcesses } from '../../types/prisma/Tenant/tenant-with-processes';

type SeedProductionOptions = { tenant: TenantWithProcesses };
export async function seedProduction({ tenant }: SeedProductionOptions) {
  const categories = await seedCategories({ s3Client, tenant, useFaker: false });

  const banks = await getGoCardLessBanks(CountryCode.FR);

  const { tenantLocationClusters } = await seedTenantLocation({ s3Client, tenant, useFaker: false });
  await seedTeams({ s3Client, banks, tenantLocationClusters, categories, tenant, useFaker: false });
}
