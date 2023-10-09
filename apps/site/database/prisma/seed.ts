import { prisma } from './db';
import { DEFAULT_TENANT_ROLES } from './seeders/default-roles';
import { seedTenant } from './seeders/seed-tenant';
import { seedDevelopment } from './seed-development';
import { seedProduction } from './seed-production';

import { baseTenantDomain, isProduction } from '../../config';
import { adminPassword, passwordHashSecret, s3Client } from '../../config/secrets';

import { BASE_TENANT_NAME } from '@okampus/shared/consts';

import { hash } from 'argon2';

export async function main() {
  const domain = baseTenantDomain ?? BASE_TENANT_NAME;

  let admin;
  const tenant = await prisma.tenant.findFirst({ where: { domain: baseTenantDomain } });

  if (tenant) {
    console.log('Tenant already exists, skipping tenant seeding..');
    admin = await prisma.user.findFirst({ where: { slug: 'admin' } });
  } else {
    console.log(`Tenant not found, create base tenant "${domain}"..`);
    const tenantScope = await seedTenant({ s3Client, domain });
    const tenantScopeId = tenantScope.id;

    const [okampusRoleData, ...tenantRolesData] = DEFAULT_TENANT_ROLES;

    await Promise.all(
      tenantRolesData.map(async (data) => await prisma.tenantRole.create({ data: { ...data, tenantScopeId } })),
    );

    const okampusRole = await prisma.tenantRole.create({ data: { ...okampusRoleData, tenantScopeId } });

    // Anononymous user
    await prisma.user.create({
      data: {
        slug: 'anon',
        firstName: 'Utilisateur',
        lastName: 'anonyme',
        actor: { create: { name: 'Utilisateur anonyme' } },
        originalTenantScope: { connect: { id: tenantScopeId } },
      },
    });

    admin = await prisma.user.create({
      data: {
        slug: 'admin',
        firstName: 'Okampus',
        lastName: 'Admin',
        actor: { create: { name: 'Okampus Admin' } },
        tenantMemberships: {
          create: {
            tenantMemberRoles: { create: [{ tenantRoleId: okampusRole.id }] },
            tenantScopeId,
          },
        },
        passwordHash: await hash(adminPassword, { secret: passwordHashSecret }),
        originalTenantScope: { connect: { id: tenantScopeId } },
      },
    });
  }

  if (admin) {
    const passwordHash = await hash(adminPassword, { secret: passwordHashSecret });
    if (admin.passwordHash !== passwordHash) {
      console.log('Admin password changed, updating..');
      await prisma.user.update({ where: { id: admin.id }, data: { passwordHash } });
    }
  } else {
    throw new Error('Tenant exists but admin not found. Please check your database.');
  }

  const anyTeam = await prisma.team.findFirst();
  if (tenant && !anyTeam) {
    console.log(`No team found, initialize complete seed in "${isProduction ? 'prod' : 'dev'}" mode..`);
    if (isProduction) {
      await seedProduction({ tenant });
    } else {
      const eventValidationForm =
        tenant.eventValidationFormId && (await prisma.form.findFirst({ where: { id: tenant.eventValidationFormId } }));
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
    console.log('Teams already exists, skipping extra seeding..');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
