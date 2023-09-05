import { customSeederFolder, seedConfig } from '../seed.config';
import { config } from '../../config';

import { readFileOrNull, readS3File } from '@okampus/api/shards';
import { parseYaml, randomId, toSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import path from 'node:path';

import type { S3Client } from '@aws-sdk/client-s3';

export type BankData = {
  name: string;
  bankCode: number;
  slug?: string;
  siren?: string;
  parent?: string;
};

function fakeBanksData(): BankData[] {
  return Array.from({ length: seedConfig.N_TEAMS }).map(() => {
    const name = faker.company.name();
    return {
      name,
      bankCode: faker.number.int({ min: 100_000, max: 999_999 }),
      slug: `${toSlug(name)}-${randomId()}`,
      website: faker.internet.url(),
      siren: faker.number.int({ min: 100_000_000, max: 999_999_999 }).toString(),
    };
  });
}

export async function getBanksData(s3Client: S3Client | null): Promise<BankData[]> {
  const file = s3Client
    ? await readS3File(s3Client, config.s3.bucketSeeding, `universal/banks.yaml`)
    : await readFileOrNull(path.join(customSeederFolder, 'banks.yaml'));

  if (!file) return fakeBanksData();

  const banksData = await parseYaml<BankData[]>(file.toString());
  if (!Array.isArray(banksData)) return fakeBanksData();

  const banks = banksData.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (banks.length === 0) return fakeBanksData();

  return banks;
}
