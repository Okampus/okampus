import { parseSeedYaml } from './from-yaml';
import prisma from '../db';

import { tenantWithProcesses } from '../../../types/prisma/Tenant/tenant-with-processes';
import { ActorType } from '@prisma/client';
import type { S3Client } from '@aws-sdk/client-s3';

type SeedTenantOptions = { s3Client: S3Client | null; domain: string };

function fakeTenantData() {
  return {
    domain: 'demo',
    name: 'Demo Tenant',
    pointName: 'LXP',
    eventValidationForm: { schema: [] },
    eventApprovalSteps: ['Validation de principe', 'Validation tenantLocation', 'Validation du directeur'],
  };
}

export async function seedTenant({ s3Client, domain }: SeedTenantOptions) {
  const {
    name,
    eventValidationForm: formData,
    eventApprovalSteps,
    ...tenantData
  } = await parseSeedYaml(s3Client, `${domain}/tenant.yaml`, fakeTenantData);
  const tenant = await prisma.tenant.create({
    data: {
      ...tenantData,
      domain,
      actor: { create: { name, type: ActorType.Tenant } },
      scopedEventApprovalSteps: {
        createMany: { data: eventApprovalSteps.map((step, idx) => ({ name: step, order: idx })) },
      },
    },
    select: tenantWithProcesses.select,
  });

  const eventValidationForm = await prisma.form.create({
    data: { ...formData, tenantScopeId: tenant.id, eventValidationFormOfTenant: { connect: { id: tenant.id } } },
  });

  return { ...tenant, eventValidationForm };
}
