import SideBar from '../../../../../components/layouts/SideBar';
import EventManageButton from '../../../../../components/layouts/SideBar/ManageButton/EventManageButton';
import EventSidePanel from '../../../../../components/layouts/SidePanel/EventSidePanel';
import SidebarBanner from '../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../ssr/getApolloQuery';

import { eventDetailsInfo } from '@okampus/shared/graphql';

import { IconInfoHexagon, IconListDetails } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import type { EventDetailsInfo } from '@okampus/shared/graphql';

type EventLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function EventLayout({ children, params }: EventLayoutProps) {
  const query = [{ where: { slug: { _eq: params.slug } }, limit: 1 }, eventDetailsInfo];
  const [event] = await getApolloQuery<EventDetailsInfo[]>('event', query, true).catch(() => []);

  if (!event) return notFound();

  const baseRoute = `/event/${params.slug}`;
  const eventRoute = (route: string) => `${baseRoute}/${route}`;
  return (
    <>
      <ApolloWriteCache values={[[event, eventDetailsInfo]]} />
      <ApolloSubscribe selector={{ eventByPk: [{ id: event.id }, eventDetailsInfo] }} />
      <SideBar>
        <SidebarBanner name={event.name} banner={event.banner?.url} />
        <EventManageButton slug={params.slug} manage={true} />
        <LinkList
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
