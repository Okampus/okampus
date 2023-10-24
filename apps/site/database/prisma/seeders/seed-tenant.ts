import { parseSeedYaml } from './from-yaml';
import { prisma } from '../db';

import { ActorType } from '@prisma/client';
import type { S3Client } from '@aws-sdk/client-s3';

type SeedTenantOptions = { s3Client: S3Client | null; domain: string };

function fakeTenantData() {
  return {
    domain: 'demo',
    name: 'Demo Tenant',
    pointName: 'LXP',
    eventValidationForm: { schema: [] },
    eventApprovalSteps: ['Validation de principe', 'Validation campus', 'Validation du directeur'],
  };
}

export async function seedTenant({ s3Client, domain }: SeedTenantOptions) {
  const { name, eventValidationForm, eventApprovalSteps, ...tenantData } = await parseSeedYaml(
    s3Client,
    `${domain}/tenant.yaml`,
    fakeTenantData,
  );
  const tenant = await prisma.tenant.create({
    data: {
      ...tenantData,
      domain,
      actor: { create: { name, type: ActorType.Tenant } },
      scopedEventApprovalSteps: {
        createMany: { data: eventApprovalSteps.map((step, idx) => ({ name: step, order: idx })) },
      },
    },
  });

  await prisma.form.create({
    data: { ...eventValidationForm, tenantScopeId: tenant.id, validationFormOfTenant: { connect: { id: tenant.id } } },
  });

  return tenant;
}
