import { N_DEFAULT_BANKS } from './defaults';
import { parseSeedYaml } from './from-yaml';
import { prisma } from '../db';

import { LegalUnitType } from '@okampus/shared/enums';
import { uniqueSlug } from '@okampus/shared/utils';
import { faker } from '@faker-js/faker';

import type { S3Client } from '@aws-sdk/client-s3';

type BankData = {
  bankCode: number;
  name: string;
  slug?: string;
  website: string;
  siren: string;
  legalName: string;
  type: LegalUnitType;
};
function fakeBanksData(): BankData[] {
  return Array.from({ length: N_DEFAULT_BANKS }).map(() => {
    const name = faker.company.name();
    return {
      name,
      bankCode: faker.number.int({ min: 100_000, max: 999_999 }),
      slug: uniqueSlug(name),
      website: faker.internet.url(),
      siren: faker.number.int({ min: 100_000_000, max: 999_999_999 }).toString(),
      legalName: name.toUpperCase(),
      type: LegalUnitType.Bank,
    };
  });
}

type SeedBankOptions = { s3Client: S3Client | null; useFaker?: boolean };
export async function seedBanks({ s3Client, useFaker }: SeedBankOptions) {
  const faker = useFaker ? fakeBanksData : () => [];
  const banksData = await parseSeedYaml(s3Client, 'banks.yaml', faker);
  const banks = await Promise.all(
    banksData.map(
      async ({ name, slug, website, ...bank }) =>
        await prisma.legalUnit.create({
          data: { actor: { create: { name, website } }, slug: slug || uniqueSlug(name), ...bank },
        }),
    ),
  );
  return banks;
}
