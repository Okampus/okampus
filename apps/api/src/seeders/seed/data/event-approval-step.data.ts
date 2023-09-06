import { seedConfig, customSeederFolder } from '../../seed.config';
import { config } from '../../../config';

import { readFileOrNull, readS3File } from '@okampus/api/shards';
import { parseYaml } from '@okampus/shared/utils';

import path from 'node:path';

import type { S3Client } from '@aws-sdk/client-s3';
import type { Tenant } from '@okampus/api/dal';

export type EventApprovalStepData = {
  order: number;
  name: string;
};

function fakeEventApprovalStepsData(): EventApprovalStepData[] {
  return Array.from({ length: seedConfig.N_TEAMS }).map((_, order) => {
    const name =
      order === 1
        ? 'Validation de principe'
        : order === 2
        ? 'Validation campus'
        : order === 3
        ? 'Validation du directeur'
        : `Validation #${order}`;

    return { order, name };
  });
}

export async function getEventApprovalStepsData(
  s3Client: S3Client | null,
  tenant: Tenant,
): Promise<EventApprovalStepData[]> {
  const file = s3Client
    ? await readS3File(s3Client, config.s3.bucketSeeding, `${tenant.domain}/event-approval-steps.yaml`)
    : await readFileOrNull(path.join(customSeederFolder, 'event-approval-steps.yaml'));

  if (!file) return fakeEventApprovalStepsData();

  const banksData = await parseYaml<EventApprovalStepData[]>(file.toString());
  if (!Array.isArray(banksData)) return fakeEventApprovalStepsData();

  const banks = banksData.filter(({ name }) => typeof name === 'string' && name.length > 0);
  if (banks.length === 0) return fakeEventApprovalStepsData();

  return banks;
}
