import AvatarImage from '../../../../../../../../../_components/atoms/Image/AvatarImage';
import BaseView from '../../../../../../../../../_components/templates/BaseView';
import BankAccountsForm from '../../../../../../../../../_views/Form/BankAccountsForm';

import prisma from '../../../../../../../../../../database/prisma/db';

import { getGoCardLessBankAccounts } from '../../../../../../../../../../server/services/bank';
import { bankMinimal } from '../../../../../../../../../../types/prisma/Bank/bank-minimal';

import { notFound, redirect } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../../../../params.type';

export type BankOnboardPageProps = { params: DomainSlugParams['params'] & { institutionId: string } };
export default async function BankOnboardPage({ params }: BankOnboardPageProps) {
  const team = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { id: true, slug: true, actor: { select: { name: true } } },
  });

  if (!team) notFound();

  const requisition = await prisma.bankRequisition.findFirst({
    where: {
      accountsLastAccessedAt: null,
      bankId: params.institutionId,
      team: { slug: params.slug, tenantScope: { domain: params.domain } },
    },
    select: { goCardLessRequisitionId: true, validatedAt: true, bank: bankMinimal },
  });

  if (!requisition) redirect(`/manage/team/${params.slug}/bank`);

  const accounts = await getGoCardLessBankAccounts(requisition.goCardLessRequisitionId);

  if (!requisition.validatedAt) {
    await prisma.bankRequisition.update({
      where: { goCardLessRequisitionId: requisition.goCardLessRequisitionId },
      data: { validatedAt: new Date() },
    });
  }

  // TODO: use owner address
  return (
    <BaseView header="Ajouter vos comptes bancaires" contentMode="centered-6xl">
      <div className="flex gap-6 items-center mb-8">
        <AvatarImage actor={requisition.bank.actor} size={64} className="rounded-[50%]" />
        <div className="font-semibold text-2xl">{requisition.bank.name}</div>
      </div>
      <BankAccountsForm initialAccounts={accounts} teamId={team.id} bank={requisition.bank} />
    </BaseView>
  );
}
