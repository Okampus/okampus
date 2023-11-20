import BaseView from '../../../../../../../../_components/templates/BaseView';
import BankList from '../../../../../../../../_views/Bank/BankList';

import prisma from '../../../../../../../../../database/prisma/db';

import { bankMinimal } from '../../../../../../../../../types/prisma/Bank/bank-minimal';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../../../params.type';

export default async function OnboardBank({ params }: DomainSlugParams) {
  const team = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { id: true },
  });

  if (!team) notFound();

  const banks = await prisma.bank.findMany({ select: bankMinimal.select });

  return (
    <BaseView header="Sélectionner votre banque">
      <BankList banks={banks} teamId={team.id} domain={params.domain} />
    </BaseView>
  );
}
