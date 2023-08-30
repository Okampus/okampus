import GroupItem from '../../../../../../components/atoms/Item/GroupItem';
import SideBar from '../../../../../../components/layouts/SideBar';
import EventManageSidePanel from '../../../../../../components/layouts/SidePanel/EventManageSidePanel';
import EventManageButton from '../../../../../../components/layouts/SideBar/ManageButton/EventManageButton';
import SidebarBanner from '../../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../../ssr/getApolloQuery';

import { getSubscriptionFromQuery } from '../../../../../../utils/apollo/get-from-query';
import { GetEventManageDocument } from '@okampus/shared/graphql';

import { IconInfoHexagon, IconUsers, IconCheckbox, IconArrowLeft, IconTicket } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import type { GetEventManageQuery, GetEventManageQueryVariables } from '@okampus/shared/graphql';

const SubscribeEventManageDocument = getSubscriptionFromQuery(GetEventManageDocument);

type ManageEventLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ManageEventLayout({ children, params }: ManageEventLayoutProps) {
  const variables = { slug: params.slug };
  const data = await getApolloQuery<GetEventManageQuery, GetEventManageQueryVariables>({
    query: GetEventManageDocument,
    variables,
  }).catch();

  const eventManage = data.event[0];
  if (!eventManage) notFound();

  const managingTeams = eventManage?.eventOrganizes.map((eventOrganize) => eventOrganize.team);
  const manageEventRoute = (route: string) => `/manage/event/${eventManage?.slug}/${route}`;

  return (
    <>
      <ApolloWriteCache values={[[eventManage, GetEventManageDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeEventManageDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={eventManage?.name} src={eventManage.banner?.url} />}>
        <EventManageButton slug={params.slug} manage={false} />
        <GroupItem heading="Paramètres" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Informations', href: `/manage/event/${eventManage?.slug}`, icon: <IconInfoHexagon /> },
              { label: "Paramètres d'inscription", href: manageEventRoute('parameters'), icon: <IconTicket /> },
            ]}
          />
        </GroupItem>
        <hr className="m-2 border-[var(--border-2)]" />
        <GroupItem heading="Présence" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Inscriptions', href: manageEventRoute('joins'), icon: <IconUsers /> },
              { label: 'Liste de présence', href: manageEventRoute('attendance'), icon: <IconCheckbox /> },
            ]}
          />
        </GroupItem>
        <hr className="m-2 border-[var(--border-2)]" />
        <LinkList
          mode="sidebar"
          items={
            managingTeams.map((team) => ({
              label: team.actor.name,
              href: `/manage/team/${team.slug}/events`,
              icon: <IconArrowLeft />,
            })) || []
          }
        />
      </SideBar>
      {children}
      <EventManageSidePanel id={eventManage.id} />
    </>
  );
}
