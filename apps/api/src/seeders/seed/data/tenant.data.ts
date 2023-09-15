import { customSeederFolder } from '../../seed.config';
import { config } from '../../../config';

import { readFileOrNull, readS3File } from '@okampus/api/shards';
import { parseYaml } from '@okampus/shared/utils';

import path from 'node:path';

import type { S3Client } from '@aws-sdk/client-s3';
import type { Tenant } from '@okampus/api/dal';
import type { FormSchema } from '@okampus/shared/types';

export type TenantData = {
  name: string;
  pointName: string;
  eventApprovalSteps: string[];
  eventValidationForm: {
    schema: FormSchema;
    isAllowingEditingAnswers: boolean;
  };
};

function fakeTenantData(): TenantData {
  return {
    name: 'Demo Tenant',
    pointName: 'LXP',
    eventApprovalSteps: ['Validation de principe', 'Validation campus', 'Validation du directeur'],
    eventValidationForm: {
      schema: [],
      isAllowingEditingAnswers: true,
    },
  };
}

export async function getTenantData(s3Client: S3Client | null, tenant: Tenant): Promise<TenantData> {
  const file = s3Client
    ? await readS3File(s3Client, config.s3.bucketSeeding, `${tenant.domain}/tenant.yaml`)
    : await readFileOrNull(path.join(customSeederFolder, 'tenant.yaml'));

  const fakeTenant = fakeTenantData();
  if (!file) return fakeTenant;

  const tenantData = await parseYaml<TenantData>(file.toString());
  if (!tenantData) return fakeTenant;

  tenantData.name = tenantData.name ?? fakeTenant.name;
  tenantData.pointName = tenantData.pointName ?? fakeTenant.pointName;
  tenantData.eventApprovalSteps = tenantData.eventApprovalSteps ?? fakeTenant.eventApprovalSteps;
  tenantData.eventValidationForm = tenantData.eventValidationForm ?? fakeTenant.eventValidationForm;

  return tenantData;
}
