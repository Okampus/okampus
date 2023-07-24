import SideBar from '../../../../../components/layouts/SideBar';
import SidebarBanner from '../../../../../components/layouts/SideBar/SidebarBanner';
import EventManageButton from '../../../../../components/layouts/SideBar/ManageButton/EventManageButton';
import TeamSidePanel from '../../../../../components/layouts/SidePanel/TeamSidePanel';
import LinkList from '../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../ssr/getApolloQuery';
import { getBanner } from '../../../../../utils/actor-image/get-banner';

import { teamWithMembersInfo } from '@okampus/shared/graphql';
import { IconUsers, IconTicket } from '@tabler/icons-react';

import type { TeamWithMembersInfo } from '@okampus/shared/graphql';

type TeamLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function TeamLayout({ children, params }: TeamLayoutProps) {
  const query = [{ where: { actor: { slug: { _eq: params.slug } } }, limit: 1 }, teamWithMembersInfo];
  const [team] = await getApolloQuery<TeamWithMembersInfo[]>('team', query, true).catch(() => []);

  if (!team) return null;

  const teamRoute = (route: string) => `/team/${team?.actor?.slug}/${route}`;
  return (
    <>
      <ApolloWriteCache values={[[team, teamWithMembersInfo]]} />
      <ApolloSubscribe selector={{ teamByPk: [{ id: team.id }, teamWithMembersInfo] }} />
      <SideBar>
        <SidebarBanner name={team.actor.name} banner={getBanner(team.actor.actorImages)?.image.url} />
        <EventManageButton slug={params.slug} manage={true} />
        <LinkList
          items={[
            { label: 'Présentation', href: `/team/${team.actor.slug}`, icon: <IconUsers /> },
            { label: 'Événements', href: teamRoute('events'), icon: <IconTicket /> },
          ]}
        />
      </SideBar>
      {children}
      <TeamSidePanel slug={team.actor.slug} />
    </>
  );
}