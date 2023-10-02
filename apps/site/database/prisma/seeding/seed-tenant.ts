import { parseSeedYaml } from '../parse-seed-yaml';
import { prisma } from '../db';

import type { Prisma } from '@prisma/client';
import type { S3Client } from '@aws-sdk/client-s3';

type SeedTenantOptions = { s3Client: S3Client | null; domain: string };

function fakeTenantData(): Prisma.TenantCreateInput {
  return {
    domain: 'demo',
    actor: { create: { name: 'Demo Tenant' } },
    pointName: 'LXP',
    scopedEventApprovalSteps: {
      createMany: {
        data: [
          { name: 'Validation de principe', order: 0 },
          { name: 'Validation campus', order: 1 },
          { name: 'Validation du directeur', order: 2 },
        ],
      },
    },
  };
}

export async function seedTenant({ s3Client, domain }: SeedTenantOptions) {
  const tenantData = await parseSeedYaml(s3Client, `${domain}/tenant.yaml`, fakeTenantData);
  return prisma.tenant.create({ data: tenantData });
}
