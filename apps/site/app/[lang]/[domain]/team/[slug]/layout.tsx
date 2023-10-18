import SkeletonPublicSidebar from '../../../../_components/atoms/Skeleton/SkeletonPublicSidebar';
import SideBar from '../../../../_components/layouts/SideBar';
import TeamManageButton from '../../../../_components/layouts/SideBar/ManageButton/TeamManageButton';
import SidebarBanner from '../../../../_components/layouts/SideBar/SidebarBanner';
import TeamSidePanel from '../../../../_components/layouts/SidePanel/TeamSidePanel';
import LinkList from '../../../../_components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../_components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../_components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../server/ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../utils/apollo/get-from-query';
import { urlJoin } from '../../../../../utils/url-join';

import { GetTeamDocument } from '@okampus/shared/graphql';

import { Users, Ticket } from '@phosphor-icons/react/dist/ssr';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import type { GetTeamQuery, GetTeamQueryVariables } from '@okampus/shared/graphql';

const SubscribeTeamDocument = getSubscriptionFromQuery(GetTeamDocument);

type TeamLayoutProps = { children: React.ReactNode; params: { slug: string } };
async function TeamLayout({ children, params }: TeamLayoutProps) {
  const variables = { slug: params.slug };
  const { data, errors } = await getApolloQuery<GetTeamQuery, GetTeamQueryVariables>({
    query: GetTeamDocument,
    variables,
  });

  if (process.env.NODE_ENV !== 'production') console.warn({ data, errors: JSON.stringify(errors) });
  if (errors) redirect(`/403?message=${JSON.stringify(errors)}`);

  const team = data.team[0];
  const teamRoute = (route: string) => urlJoin('/team', team.slug, route);

  return (
    <>
      <ApolloWriteCache values={[[team, GetTeamDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeTeamDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={team.actor.name} src={team.actor.banner} />}>
        <TeamManageButton slug={params.slug} manage={true} />
        <LinkList
          mode="sidebar"
          items={[
            { label: 'Présentation', href: `/team/${team.slug}`, icon: <Users /> },
            { label: 'Événements', href: teamRoute('events'), icon: <Ticket /> },
          ]}
        />
      </SideBar>
      {children}
      <TeamSidePanel slug={team.slug} />
    </>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default ({ children, params }: TeamLayoutProps) => (
  <Suspense
    fallback={
      <>
        <SkeletonPublicSidebar />
        {children}
      </>
    }
  >
    <TeamLayout params={params}>{children}</TeamLayout>
  </Suspense>
);