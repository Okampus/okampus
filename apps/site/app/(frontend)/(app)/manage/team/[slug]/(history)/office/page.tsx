'use client';

import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';

import { useTeamManage } from '../../../../../../../../context/navigation';
import { IconHistory } from '@tabler/icons-react';

export default function TeamManageOfficePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  return (
    <ViewLayout header="Bureau de l'association" sidePanelIcon={<IconHistory />}>
      TODO
    </ViewLayout>
  );
}
