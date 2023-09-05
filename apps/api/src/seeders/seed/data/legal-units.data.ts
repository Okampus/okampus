import { seedConfig, customSeederFolder } from '../../seed.config';
import { config } from '../../../config';

import { readFileOrNull, readS3File } from '@okampus/api/shards';
import { parseYaml, randomId, toSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import path from 'node:path';

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
  return Array.from({ length: seedConfig.N_TEAMS }).map(() => {
    const name = faker.company.name();
    return {
      name,
      slug: `${toSlug(name)}-${randomId()}`,
      website: faker.internet.url(),
      siren: faker.number.int({ min: 100_000_000, max: 999_999_999 }).toString(),
    };
  });
}

export async function getLegalUnitsData(s3Client: S3Client | null): Promise<LegalUnitData[]> {
  const file = s3Client
    ? await readS3File(s3Client, config.s3.bucketSeeding, `universal/legal-units.yaml`)
    : await readFileOrNull(path.join(customSeederFolder, 'legal-units.yaml'));

  if (!file) return fakeLegalUnitsData();

  const legalUnitsData = await parseYaml<LegalUnitData[]>(file.toString());
  if (!Array.isArray(legalUnitsData)) return fakeLegalUnitsData();

  const legalUnits = legalUnitsData.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (legalUnits.length === 0) return fakeLegalUnitsData();

  return legalUnits;
}
