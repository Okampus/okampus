import PanelView from '../../../_components/templates/PanelView';
import Sidebar from '../../../_components/layouts/Sidebar';
import HomeSidepanel from '../../../_components/layouts/SidePanel/HomeSidepanel';

import HomeView from '../../../_views/HomeView';
import WelcomeHeader from '../../../_views/WelcomeHeader';

import prisma from '../../../../database/prisma/db';

import { teamMinimal } from '../../../../types/prisma/Team/team-minimal';

import type { DomainParams } from '../../../params.type';

export default async function HomePage({ params }: DomainParams) {
  const teams = await prisma.team.findMany({
    where: { tenantScope: { domain: params.domain } },
    select: teamMinimal.select,
  });

  return (
    <>
      <Sidebar />
      <PanelView
        className="bg-1"
        paddingMode="large"
        headerSmall={<WelcomeHeader />}
        content={<HomeView domain={params.domain} />}
        panel={<HomeSidepanel teams={teams} />}
      />
    </>
  );
}
