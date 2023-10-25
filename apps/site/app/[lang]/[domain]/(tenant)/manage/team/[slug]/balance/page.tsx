'use client';

import { useTeamManage } from '../../../../../../../_context/navigation';

export default function TeamManageBankInfoPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  return <div>Vos informations bancaires: {teamManage?.actor?.name}</div>;
}
