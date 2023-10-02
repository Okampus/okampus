import Skeleton from '../../../../_components/atoms/Skeleton/Skeleton';
import SkeletonLinkItem from '../../../../_components/atoms/Skeleton/SkeletonLinkItem';

import SideBar from '../../../../_components/layouts/SideBar';
import EventManageButton from '../../../../_components/layouts/SideBar/ManageButton/EventManageButton';
import SidebarBanner from '../../../../_components/layouts/SideBar/SidebarBanner';

import LinkList from '../../../../_components/molecules/List/LinkList';
import SimpleList from '../../../../_components/molecules/List/SimpleList';

import { IconInfoCircle, IconListDetails, IconArrowLeft } from '@tabler/icons-react';

import type { EventInfo } from '../../../../../utils/apollo/fragments';

export type EventSidebarProps = { event: EventInfo | null };
export default function EventSidebar({ event }: EventSidebarProps) {
  if (!event) {
    return (
      <SideBar header={<Skeleton className="h-12 w-[calc(100%-1rem)] mx-[0.5rem] mb-3" />}>
        <SimpleList heading="Présence" headingClassName="ml-3">
          {Array.from({ length: 2 }).map((_, idx) => (
            <SkeletonLinkItem key={idx} />
          ))}
        </SimpleList>
        <hr className="m-2 border-[var(--border-2)]" />
        <SkeletonLinkItem />
      </SideBar>
    );
  }

  const baseRoute = `/event/${event.slug}`;
  const eventRoute = (route: string) => `${baseRoute}/${route}`;
  const managingTeams = event.eventOrganizes.map((eventOrganize) => eventOrganize.team);

  return (
    <SideBar header={<SidebarBanner name={event.name} src={event.banner?.url} />}>
      <EventManageButton slug={event.slug} manage={true} />
      <SimpleList heading="Présence" headingClassName="ml-3">
        <LinkList
          mode="sidebar"
          items={[
            { label: 'Informations', href: baseRoute, icon: <IconInfoCircle /> },
            { label: 'Inscrits', href: eventRoute('joins'), icon: <IconListDetails /> },
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
            icon: <IconArrowLeft />,
          })) || []
        }
      />
    </SideBar>
  );
}
