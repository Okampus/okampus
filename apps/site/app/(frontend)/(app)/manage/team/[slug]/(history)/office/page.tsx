'use client';

import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import { useTeamManage } from '../../../../../../../../context/navigation';

export default function TeamManageOfficePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  return <ViewLayout header="Bureau de l'association">TODO</ViewLayout>;
}
