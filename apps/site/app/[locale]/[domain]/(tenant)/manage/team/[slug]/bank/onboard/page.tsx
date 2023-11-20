import prisma from '../../../../../../../../../database/prisma/db';

import { notFound, redirect } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../../../params.type';

export default async function BankOnboardPage({ params }: DomainSlugParams) {
  const team = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: {
      id: true,
      slug: true,
      bankRequisitions: {
        select: { goCardLessRequisitionId: true, bankId: true },
        where: { accountsLastAccessedAt: null },
      },
    },
  });

  if (!team) notFound();

  if (team.bankRequisitions.length === 0) redirect(`/manage/team/${params.slug}/bank`);
  if (team.bankRequisitions.length === 1)
    redirect(`/manage/team/${params.slug}/bank/onboard/${team.bankRequisitions[0].bankId}`);

  // TODO: Deal with multiple requisitions
  redirect(`/manage/team/${params.slug}/bank`);
}
