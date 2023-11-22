import prisma from './db';
import { DEFAULT_TENANT_ROLES } from './seeders/defaults';
import { seedTenant } from './seeders/seed-tenant';
import { seedDevelopment } from './seed-development';
import { seedProduction } from './seed-production';

import { baseTenantDomain } from '../../config';
import { adminPassword, passwordHashSecret, s3Client } from '../../server/secrets';
import { tenantWithProcesses } from '../../types/prisma/Tenant/tenant-with-processes';

import { BASE_TENANT_NAME } from '@okampus/shared/consts';

import { ActorType } from '@prisma/client';

import { hash } from 'argon2';
import debug from 'debug';

const debugLog = debug('okampus:seed');
export async function main() {
  const domain = baseTenantDomain ?? BASE_TENANT_NAME;

  let admin;
  let tenant = await prisma.tenant.findFirst({
    where: { domain: baseTenantDomain },
    select: tenantWithProcesses.select,
  });

  if (tenant) {
    debugLog('Tenant already exists, skipping tenant seeding..');
    admin = await prisma.user.findFirst({ where: { slug: 'admin' } });
  } else {
    debugLog(`Tenant not found, create base tenant "${domain}"..`);
    tenant = await seedTenant({ s3Client, domain });
    const tenantScopeId = tenant.id;

    await Promise.all(
      DEFAULT_TENANT_ROLES.map(async (data) => await prisma.tenantRole.create({ data: { ...data, tenantScopeId } })),
    );

    // Anononymous user
    await prisma.user.create({
      data: {
        slug: 'anon',
        firstName: 'Utilisateur',
        lastName: 'anonyme',
        actor: { create: { name: 'Utilisateur anonyme', type: ActorType.User } },
        tenantScope: { connect: { id: tenantScopeId } },
      },
    });

    admin = await prisma.user.create({
      data: {
        slug: 'admin',
        firstName: 'Okampus',
        lastName: 'Admin',
        actor: { create: { name: 'Okampus Admin', type: ActorType.User } },
        adminRoles: { create: { canCreateTenant: true, canDeleteTenantEntities: true, canManageTenantEntities: true } },
        passwordHash: await hash(adminPassword, { secret: passwordHashSecret }),
        tenantScope: { connect: { id: tenantScopeId } },
      },
    });
  }

  if (admin) {
    const passwordHash = await hash(adminPassword, { secret: passwordHashSecret });
    if (admin.passwordHash !== passwordHash) {
      debugLog('Admin password changed, updating..');
      await prisma.user.update({ where: { id: admin.id }, data: { passwordHash } });
    }
  } else {
    throw new Error('Tenant exists but admin not found. Please check your database.');
  }

  const anyTeam = await prisma.team.findFirst();
  debugLog('Any team found:', anyTeam);
  if (tenant && !anyTeam) {
    debugLog(
      `No team found, initialize complete seed in "${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}" mode..`,
    );
    if (process.env.NODE_ENV === 'production') {
      await seedProduction({ tenant });
    } else {
      const eventValidationForm =
        tenant.eventValidationForm?.id &&
        (await prisma.form.findFirst({ where: { id: tenant.eventValidationForm.id } }));
      const scopedEventApprovalSteps = await prisma.eventApprovalStep.findMany({ where: { tenantScopeId: tenant.id } });
      await seedDevelopment({
        tenant: {
          ...tenant,
          ...(eventValidationForm && { eventValidationForm }),
          scopedEventApprovalSteps,
        },
      });
    }
  } else {
    debugLog('Teams already exists, skipping extra seeding..');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    debugLog(e);
    await prisma.$disconnect();
    process.exit(1);
  });
