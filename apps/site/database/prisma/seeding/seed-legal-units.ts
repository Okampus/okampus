import { N_DEFAULT_LEGAL_UNITS } from './defaults';
import { prisma } from '../db';
import { parseSeedYaml } from '../parse-seed-yaml';
import { LegalUnitType } from '@okampus/shared/enums';
import { toSlug, randomId } from '@okampus/shared/utils';

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
    return {
      name,
      slug: `${toSlug(name)}-${randomId()}`,
      website: faker.internet.url(),
      siren: faker.number.int({ min: 100_000_000, max: 999_999_999 }).toString(),
    };
  });
}

type SeedLegalUnitsOptions = { s3Client: S3Client | null; useFaker?: boolean };
export async function seedLegalUnits({ s3Client, useFaker }: SeedLegalUnitsOptions) {
  const faker = useFaker ? fakeLegalUnitsData : () => [];
  const legalUnitsData = await parseSeedYaml(s3Client, `legal-units.yaml`, faker);
  return await prisma.actor.createMany({
    data: legalUnitsData.map((legalUnit) => ({
      name: legalUnit.name,
      legalUnit: {
        legalName: legalUnit.name,
        slug: legalUnit.slug,
        siren: legalUnit.siren,
        type: LegalUnitType.Company,
        createdBy: null,
      },
    })),
  });
}
