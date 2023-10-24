'use client';

import OnboardBankForm from '../../../../../../../_components/forms/MultiStepPage/OnboardBankForm';

import { useTeamManage } from '../../../../../../../_context/navigation';
import { redirect } from 'next/navigation';

export default function TeamManageBankInfoCreatePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  if (!teamManage) return null;
  if (teamManage.bankAccounts.length > 0) redirect(`/manage/team/${params.slug}/bank`);

  return <OnboardBankForm onCompleted={() => redirect(`/manage/team/${params.slug}/bank`)} teamManage={teamManage} />;
}
