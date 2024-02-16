import TeamVendorsView from '../../../../../../../_views/Finance/TeamVendorsView';
import prisma from '../../../../../../../../database/prisma/db';

import { getIntlMessages } from '../../../../../../../../i18n';
import { getNextLang } from '../../../../../../../../server/ssr/getLang';
import { teamVendorMinimal } from '../../../../../../../../types/prisma/TeamVendor/team-vendor-minimal';

import { NextIntlClientProvider } from 'next-intl';

import type { DomainSlugParams } from '../../../../../../../params.type';

export default async function TeamManageTransactionsPage({ params }: DomainSlugParams) {
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { id: true },
  });

  if (!teamManage) return null;

  const teamVendors = await prisma.teamVendor.findMany({
    where: { teamId: teamManage.id },
    select: teamVendorMinimal.select,
  });

  return (
    <NextIntlClientProvider messages={await getIntlMessages(getNextLang(), ['Enums'])}>
      <TeamVendorsView teamSlug={params.slug} teamVendors={teamVendors} />
    </NextIntlClientProvider>
  );
}
