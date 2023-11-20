import prisma from '../../../../../../../../../database/prisma/db';
import BaseView from '../../../../../../../../_components/templates/BaseView';
import { CashAccountForm } from '../../../../../../../../_views/Form/CashAccountForm';
import { notFound } from 'next/navigation';
import type { DomainSlugParams } from '../../../../../../../../params.type';

// TODO: add cash account
export async function TeamCashAccount({ params }: DomainSlugParams) {
  const team = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { id: true },
  });

  if (!team) notFound();

  return (
    <>
      <BaseView>
        <CashAccountForm teamId={team.id} />
      </BaseView>
    </>
  );
}
