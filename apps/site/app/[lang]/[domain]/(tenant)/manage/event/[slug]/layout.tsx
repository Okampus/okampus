import SimpleList from '../../../../../../_components/molecules/List/SimpleList';
import SideBar from '../../../../../../_components/layouts/SideBar';
import EventManageSidePanel from '../../../../../../_components/layouts/SidePanel/EventManageSidePanel';
import EventManageButton from '../../../../../../_components/layouts/SideBar/ManageButton/EventManageButton';
import SidebarBanner from '../../../../../../_components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../../_components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../../_components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../../_components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../../../server/ssr/getApolloQuery';

import { getSubscriptionFromQuery } from '../../../../../../../utils/apollo/get-from-query';
import { urlJoin } from '../../../../../../../utils/url-join';
import { GetEventManageDocument } from '@okampus/shared/graphql';

import { Info, Users, CheckSquare, ArrowLeft, Ticket } from '@phosphor-icons/react/dist/ssr';
import { redirect } from 'next/navigation';

import type { GetEventManageQuery, GetEventManageQueryVariables } from '@okampus/shared/graphql';

const SubscribeEventManageDocument = getSubscriptionFromQuery(GetEventManageDocument);

type ManageEventLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ManageEventLayout({ children, params }: ManageEventLayoutProps) {
  const variables = { slug: params.slug };
  const { data, errors } = await getApolloQuery<GetEventManageQuery, GetEventManageQueryVariables>({
    query: GetEventManageDocument,
    variables,
  });

  if (process.env.NODE_ENV !== 'production') console.warn({ data, errors: JSON.stringify(errors) });
  if (errors) redirect(`/403?message=${JSON.stringify(errors)}`);

  const eventManage = data.event[0];

  const managingTeams = eventManage?.eventOrganizes.map((eventOrganize) => eventOrganize.team);
  const manageEventRoute = (route: string) => urlJoin('/manage/event', eventManage.slug, route);

  return (
    <>
      <ApolloWriteCache values={[[eventManage, GetEventManageDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeEventManageDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={eventManage?.name} src={eventManage.banner?.url} />}>
        <EventManageButton slug={params.slug} manage={false} />
        <SimpleList heading="Paramètres" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Informations', href: `/manage/event/${eventManage?.slug}`, icon: <Info /> },
              { label: "Paramètres d'inscription", href: manageEventRoute('parameters'), icon: <Ticket /> },
            ]}
          />
        </SimpleList>
        <hr className="mx-2 my-2.5 border-[var(--border-1)]" />
        <SimpleList heading="Présence" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Inscriptions', href: manageEventRoute('joins'), icon: <Users /> },
              { label: 'Liste de présence', href: manageEventRoute('attendance'), icon: <CheckSquare /> },
            ]}
          />
        </SimpleList>
        <hr className="m-2 border-[var(--border-2)]" />
        <LinkList
          mode="sidebar"
          items={
            managingTeams.map((team) => ({
              label: team.actor.name,
              href: `/manage/team/${team.slug}/events`,
              icon: <ArrowLeft />,
            })) || []
          }
        />
      </SideBar>
      {children}
      <EventManageSidePanel id={eventManage.id} />
    </>
  );
}
