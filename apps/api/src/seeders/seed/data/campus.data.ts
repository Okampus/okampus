import { addressesData } from './addresses.data';
import { seedConfig, customSeederFolder } from '../../seed.config';
import { config } from '../../../config';

import { readFileOrNull, readS3File } from '@okampus/api/shards';
import { parseYaml, pickOneFromArray } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import path from 'node:path';

import type { S3Client } from '@aws-sdk/client-s3';
import type { Tenant } from '@okampus/api/dal';
import type { Either } from '@okampus/shared/types';

export type CampusData = {
  clusterName: string;
  name: string;
  location: Either<{ addressGeoapifyId: string }, { link: string }> & { details?: string };
};

function fakeCampusData(): CampusData[] {
  const clusterNames = ['Paris', 'Lyon', 'Bordeaux'];
  return Array.from({ length: seedConfig.N_TEAMS }).map(() => {
    return {
      name: faker.company.name(),
      clusterName: pickOneFromArray(clusterNames),
      location: { addressGeoapifyId: pickOneFromArray(addressesData) },
    };
  });
}

export async function getCampusData(s3Client: S3Client | null, tenant: Tenant): Promise<CampusData[]> {
  const file = s3Client
    ? await readS3File(s3Client, config.s3.bucketSeeding, `${tenant.domain}/campus.yaml`)
    : await readFileOrNull(path.join(customSeederFolder, 'campus.yaml'));

  if (!file) return fakeCampusData();

  const banksData = await parseYaml<CampusData[]>(file.toString());
  if (!Array.isArray(banksData)) return fakeCampusData();

  const banks = banksData.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (banks.length === 0) return fakeCampusData();

  return banks;
}
