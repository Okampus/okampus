import CreateTransactionForm from '../../../../../../../../_views/Form/CreateTransaction/CreateTransactionForm';

import prisma from '../../../../../../../../../database/prisma/db';
import { teamWithMoneyAccounts } from '../../../../../../../../../types/prisma/Team/team-with-money-accounts';

import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../../../params.type';

export default async function TeamEventNewPageProps({ params }: DomainSlugParams) {
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: teamWithMoneyAccounts.select,
  });

  if (!teamManage) notFound();
  return <CreateTransactionForm domain={params.domain} team={teamManage} />;
}
