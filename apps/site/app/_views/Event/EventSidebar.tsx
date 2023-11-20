import SidebarLinkItem from '../../_components/atoms/Item/SidebarLinkItem';
import Sidebar from '../../_components/layouts/Sidebar';
import SidebarBanner from '../../_components/layouts/SideBar/SidebarBanner';

import { urlJoin } from '../../../utils/url-join';

import { Info, CheckCircle, ArrowLeft } from '@phosphor-icons/react/dist/ssr';

import type { EventDetails } from '../../../types/prisma/Event/event-details';

export type EventSidebarProps = { event: EventDetails };
export default function EventSidebar({ event }: EventSidebarProps) {
  const baseRoute = `/event/${event.slug}`;
  const eventRoute = (route: string) => urlJoin(baseRoute, route);

  const links = [
    { label: 'Informations', href: baseRoute, icon: <Info />, iconSelected: <Info weight="fill" /> },
    {
      label: 'Inscrits',
      href: eventRoute('attendees'),
      icon: <CheckCircle />,
      iconSelected: <CheckCircle weight="fill" />,
    },
  ];

  const managingTeamLinks = event.eventOrganizes.map((eventOrganize) => ({
    label: eventOrganize.team.actor.name,
    href: `/manage/team/${eventOrganize.team.slug}/events`,
    icon: <ArrowLeft />,
    iconSelected: <ArrowLeft weight="fill" />,
  }));

  return (
    <Sidebar header={<SidebarBanner name={event.name} src={event.banner} />}>
      {links.map((link) => (
        <SidebarLinkItem key={link.href} {...link} />
      ))}
      <hr className="m-2 border-[var(--border-2)]" />

      {managingTeamLinks.map((link) => (
        <SidebarLinkItem key={link.href} {...link} />
      ))}
    </Sidebar>
  );
}
