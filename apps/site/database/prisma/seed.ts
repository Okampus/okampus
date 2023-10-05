import { prisma } from './db';
import { seedBanks } from './seeding/seed-banks';
import { seedCampus } from './seeding/seed-campus';
import { seedTeams } from './seeding/seed-teams';
import { seedTenant } from './seeding/seed-tenant';
import { seedCategories } from './seeding/seed-categories';
import { seedLegalUnits } from './seeding/seed-legal-units';
import { baseTenantDomain, isProduction } from '../../config';
import { adminPassword, passwordHashSecret, s3Client } from '../../config/secrets';
import { BASE_TENANT_NAME } from '@okampus/shared/consts';
import { TenantRoleType, Colors } from '@okampus/shared/enums';

import { hash } from 'argon2';

import type { SeedTeamsOptions } from './seeding/seed-teams';

async function seedProduction(tenant: { id: bigint; actorId: bigint; domain: string }) {
  const categories = await seedCategories({ s3Client, tenant, useFaker: false });

  const banks = await seedBanks({ s3Client, useFaker: false });
  const banksWithCode = banks.filter((bank) => bank.bankCode) as SeedTeamsOptions['banks'];

  await seedTeams({ s3Client, banks: banksWithCode, categories, tenant, useFaker: false });
  await seedCampus({ s3Client, tenant, useFaker: false });
  await seedLegalUnits({ s3Client, useFaker: false });
}

export async function main() {
  const domain = baseTenantDomain ?? BASE_TENANT_NAME;

  let admin;
  const tenant = await prisma.tenant.findFirst({ where: { domain: baseTenantDomain } });
  if (tenant) {
    admin = await prisma.user.findFirst({ where: { slug: 'admin' } });
  } else {
    // Init base tenant
    const tenantScope = await seedTenant({ s3Client, domain });
    const tenantRoles = [
      {
        name: 'Administration',
        type: TenantRoleType.Administration,
        color: Colors.Red,
        canViewHidden: true,
        canHide: true,
        canCreateTeam: true,
        canManageCampus: true,
        canManageEventApprovalSteps: true,
        canManageEventApprovals: true,
        canManageTenant: true,
        tenantScopeId: tenantScope.id,
      },
      { name: 'Étudiant', type: TenantRoleType.Student, color: Colors.Blue, tenantScopeId: tenantScope.id },
      { name: 'Professeur', type: TenantRoleType.Teacher, color: Colors.LightOrange, tenantScopeId: tenantScope.id },
    ];

    await Promise.all(tenantRoles.map(async (data) => await prisma.tenantRole.create({ data })));

    const okampusRole = await prisma.tenantRole.create({
      data: {
        name: 'Okampus',
        type: TenantRoleType.Okampus,
        color: Colors.Green,
        canViewHidden: true,
        canHide: true,
        canCreateTeam: true,
        canManageCampus: true,
        canManageEventApprovalSteps: true,
        canManageEventApprovals: true,
        canManageTenant: true,
        tenantScopeId: tenantScope.id,
      },
    });

    // Anononymous user
    await prisma.user.create({
      data: {
        slug: 'anon',
        firstName: 'Utilisateur',
        lastName: 'anonyme',
        actor: { create: { name: 'Utilisateur anonyme' } },
        originalTenantScope: { connect: { id: tenantScope.id } },
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
            tenantScopeId: tenantScope.id,
          },
        },
        passwordHash: await hash(adminPassword, { secret: passwordHashSecret }),
        originalTenantScope: { connect: { id: tenantScope.id } },
      },
    });
  }

  const anyTeam = await prisma.team.findFirst();
  if (tenant && !anyTeam) {
    if (isProduction) {
      await seedProduction(tenant);
    } else {
      // TODO
    }
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
