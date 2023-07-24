'use client';

import { useTeamManage } from '../../../../../../../context/navigation';

export default function TeamManageExpenseClaimsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  return <div>Vos informations bancaires: {teamManage?.actor?.name}</div>;
}
