'use client';

import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import { useTeamManage } from '../../../../../../../../context/navigation';

export default function TeamManageArchivesPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  return <ViewLayout>Vos informations bancaires: {teamManage?.actor?.name}</ViewLayout>;
}
