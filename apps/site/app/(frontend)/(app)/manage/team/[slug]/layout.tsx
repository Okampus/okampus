import SideBar from '../../../../../_components/layouts/SideBar';
import TeamManageButton from '../../../../../_components/layouts/SideBar/ManageButton/TeamManageButton';
import SidebarBanner from '../../../../../_components/layouts/SideBar/SidebarBanner';
import TeamManageNavigation from '../../../../../_components/layouts/SideBar/TeamManageNavigation';

import ApolloSubscribe from '../../../../../_components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../_components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../../server/ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../../utils/apollo/get-from-query';

import { GetTeamManageDocument } from '@okampus/shared/graphql';
import { redirect } from 'next/navigation';

import type { GetTeamManageQuery, GetTeamManageQueryVariables } from '@okampus/shared/graphql';

const SubscribeTeamManageDocument = getSubscriptionFromQuery(GetTeamManageDocument);

type ManageTeamLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ManageTeamLayout({ children, params }: ManageTeamLayoutProps) {
  const variables = { slug: params.slug };
  const { data, errors } = await getApolloQuery<GetTeamManageQuery, GetTeamManageQueryVariables>({
    query: GetTeamManageDocument,
    variables,
  });

  if (errors) redirect(`/403?message=${JSON.stringify(errors)}`);

  const teamManage = data.team[0];

  return (
    <>
      <ApolloWriteCache values={[[teamManage, GetTeamManageDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeTeamManageDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={teamManage.actor.name} src={teamManage.actor.banner} />}>
        <TeamManageButton slug={params.slug} manage={false} />
        <TeamManageNavigation slug={params.slug} />
      </SideBar>
      {children}
    </>
  );
}
