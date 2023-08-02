import SideBar from '../../../../../../components/layouts/SideBar';
import TeamManageButton from '../../../../../../components/layouts/SideBar/ManageButton/TeamManageButton';
import SidebarBanner from '../../../../../../components/layouts/SideBar/SidebarBanner';
import TeamManageNavigation from '../../../../../../components/layouts/SideBar/TeamManageNavigation';

import ApolloSubscribe from '../../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../../ssr/getApolloQuery';
import { getBanner } from '../../../../../../utils/actor-image/get-banner';

import { teamManageInfo } from '@okampus/shared/graphql';
import { notFound } from 'next/navigation';

import type { TeamManageInfo } from '@okampus/shared/graphql';

type ManageTeamLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ManageTeamLayout({ children, params }: ManageTeamLayoutProps) {
  const query = [{ where: { actor: { slug: { _eq: params.slug } } }, limit: 1 }, teamManageInfo];
  const [teamManage] = await getApolloQuery<TeamManageInfo[]>('team', query, true).catch((error) => {
    console.error(error);
    return [];
  });

  if (!teamManage) return notFound();

  return (
    <>
      <ApolloWriteCache values={[[teamManage, teamManageInfo]]} />
      <ApolloSubscribe selector={{ teamByPk: [{ id: teamManage.id }, teamManageInfo] }} />
      <SideBar>
        <SidebarBanner name={teamManage?.actor?.name} banner={getBanner(teamManage.actor.actorImages)?.image?.url} />
        <TeamManageButton slug={params.slug} manage={false} />
        <TeamManageNavigation slug={params.slug} />
      </SideBar>
      {children}
    </>
  );
}
