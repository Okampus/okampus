import { seedBanks } from './seeders/seed-banks';
import { seedCampus } from './seeders/seed-campus';
import { seedCategories } from './seeders/seed-categories';
import { seedLegalUnits } from './seeders/seed-legal-units';
import { seedTeams } from './seeders/seed-teams';

import { s3Client } from '../../config/secrets';

import type { SeedTeamsOptions } from './seeders/seed-teams';
import type { TenantWithEventContext } from './fakers/fake-event';

type SeedProductionOptions = { tenant: TenantWithEventContext };
export async function seedProduction({ tenant }: SeedProductionOptions) {
  const categories = await seedCategories({ s3Client, tenant, useFaker: false });

  const banks = await seedBanks({ s3Client, useFaker: false });
  const banksWithCode = banks.filter((bank) => bank.bankCode) as SeedTeamsOptions['banks'];

  await seedTeams({ s3Client, banks: banksWithCode, categories, tenant, useFaker: false });
  await seedCampus({ s3Client, tenant, useFaker: false });
  await seedLegalUnits({ s3Client, useFaker: false });
}
