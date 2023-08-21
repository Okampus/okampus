'use client';

import OnboardBankForm from '../../../../../../../../components/forms/MultiStepPage/OnboardBankForm';

import { useTeamManage } from '../../../../../../../../context/navigation';
import { redirect } from 'next/navigation';

export default function TeamManageBankCreatePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  if (!teamManage) return null;
  if (teamManage.accounts.length > 0) redirect(`/manage/team/${params.slug}/bank`);

  return <OnboardBankForm onCompleted={() => redirect(`/manage/team/${params.slug}/bank`)} teamManage={teamManage} />;
}
