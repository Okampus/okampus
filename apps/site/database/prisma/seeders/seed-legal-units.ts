import { N_DEFAULT_LEGAL_UNITS } from './defaults';
import { parseSeedYaml } from './from-yaml';
import { prisma } from '../db';

import { uniqueSlug } from '@okampus/shared/utils';
import { ActorType, LegalUnitType } from '@prisma/client';

import { faker } from '@faker-js/faker';

import type { S3Client } from '@aws-sdk/client-s3';

export type LegalUnitData = {
  name: string;
  siren: string;
  slug?: string;
  parent?: string;
  website?: string;
  isFranchise?: boolean;
  isFranchiseBrand?: boolean;
};

function fakeLegalUnitsData(): LegalUnitData[] {
  return Array.from({ length: N_DEFAULT_LEGAL_UNITS }).map(() => {
    const name = faker.company.name();
    const siren = faker.number.int({ min: 100_000_000, max: 999_999_999 }).toString();
    return { name, slug: uniqueSlug(name), website: faker.internet.url(), siren };
  });
}

type SeedLegalUnitsOptions = { s3Client: S3Client | null; useFaker?: boolean };
export async function seedLegalUnits({ s3Client, useFaker }: SeedLegalUnitsOptions) {
  const faker = useFaker ? fakeLegalUnitsData : () => [];
  const legalUnitsData = await parseSeedYaml(s3Client, 'legal-units.yaml', faker);
  return await Promise.all(
    legalUnitsData.map(
      async (legalUnit) =>
        await prisma.legalUnit.create({
          data: {
            actor: { create: { name: legalUnit.name, type: ActorType.LegalUnit } },
            legalName: legalUnit.name,
            slug: legalUnit.slug || uniqueSlug(legalUnit.name),
            siren: legalUnit.siren,
            type: LegalUnitType.Company,
          },
        }),
    ),
  );
}
