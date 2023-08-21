import SideBar from '../../../../../components/layouts/SideBar';
import EventManageButton from '../../../../../components/layouts/SideBar/ManageButton/EventManageButton';
import EventSidePanel from '../../../../../components/layouts/SidePanel/EventSidePanel';
import SidebarBanner from '../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../utils/apollo/get-from-query';

import { GetEventDocument } from '@okampus/shared/graphql';

import { IconInfoHexagon, IconListDetails } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import type { GetEventQuery, GetEventQueryVariables } from '@okampus/shared/graphql';

const SubscribeEventDocument = getSubscriptionFromQuery(GetEventDocument);

type EventLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function EventLayout({ children, params }: EventLayoutProps) {
  const variables = { slug: params.slug };
  const data = await getApolloQuery<GetEventQuery, GetEventQueryVariables>({
    query: GetEventDocument,
    variables,
  }).catch();

  if (!data) return notFound();
  const event = data.event[0];

  const baseRoute = `/event/${params.slug}`;
  const eventRoute = (route: string) => `${baseRoute}/${route}`;
  return (
    <>
      <ApolloWriteCache values={[[event, GetEventDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeEventDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={event.name} banner={event.banner?.url} />}>
        <EventManageButton slug={params.slug} manage={true} />
        <LinkList
          mode="sidebar"
          items={[
            { label: 'Informations', href: baseRoute, icon: <IconInfoHexagon /> },
            { label: 'Inscrits', href: eventRoute('joins'), icon: <IconListDetails /> },
          ]}
        />
      </SideBar>
      {children}
      <EventSidePanel slug={event.slug} />
    </>
  );
}
