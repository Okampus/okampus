import Sidebar from '../../../../_components/layouts/Sidebar';
import BaseView from '../../../../_components/templates/BaseView';

import TeamList from '../../../../_views/Team/TeamList';

import prisma from '../../../../../database/prisma/db';

import { teamListDetails } from '../../../../../types/prisma/Team/team-list-details';

import type { DomainParams } from '../../../../params.type';

export default async function TeamsPage({ params }: DomainParams) {
  const teams = await prisma.team.findMany({
    where: { tenantScope: { domain: params.domain } },
    select: teamListDetails.select,
  });

  return (
    <>
      {/* <HomeSideBar title="Explorer" /> */}
      <Sidebar />
      <BaseView className="bg-1" sidePanelButton={null} header="Toutes les associations">
        {<TeamList domain={params.domain} teams={teams} />}
      </BaseView>
    </>
  );
}
