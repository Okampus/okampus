import Sidebar from '../../../../../../_components/layouts/Sidebar';
import EventManageSidePanel from '../../../../../../_components/layouts/SidePanel/EventManageSidePanel';
import SidebarBanner from '../../../../../../_components/layouts/SideBar/SidebarBanner';

import prisma from '../../../../../../../database/prisma/db';
import { eventDetails } from '../../../../../../../types/prisma/Event/event-details';
import { urlJoin } from '../../../../../../../utils/url-join';
import SidebarLinkItem from '../../../../../../_components/atoms/Item/SidebarLinkItem';
import { Info, Users, CheckSquare, ArrowLeft, Ticket } from '@phosphor-icons/react/dist/ssr';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../params.type';

export default async function ManageEventLayout({
  children,
  params,
}: { children: React.ReactNode } & DomainSlugParams) {
  const eventManage = await prisma.event.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { ...eventDetails.select, tenantScope: { select: { pointName: true } } },
  });

  if (!eventManage) notFound();

  const managingTeams = eventManage.eventOrganizes.map((eventOrganize) => eventOrganize.team);
  const manageEventRoute = (route: string) => urlJoin('/manage/event', eventManage.slug, route);

  const infoLinks = [
    { label: 'Informations', href: manageEventRoute(''), icon: <Info />, iconSelected: <Info weight="fill" /> },
    {
      label: "Paramètres d'inscription",
      href: manageEventRoute('parameters'),
      icon: <Ticket />,
      iconSelected: <Ticket weight="fill" />,
    },
  ];

  const detailsLinks = [
    {
      label: 'Inscriptions',
      href: manageEventRoute('registrations'),
      icon: <Users />,
      iconSelected: <Users weight="fill" />,
    },
    {
      label: 'Liste de présence',
      href: manageEventRoute('attendees'),
      icon: <CheckSquare />,
      iconSelected: <CheckSquare weight="fill" />,
    },
  ];

  const managingTeamLinks = managingTeams.map((team) => ({
    label: team.actor.name,
    href: `/manage/team/${team.slug}/events`,
    icon: <ArrowLeft />,
    iconSelected: <ArrowLeft weight="fill" />,
  }));

  return (
    <>
      <Sidebar header={<SidebarBanner name={eventManage?.name} src={eventManage.banner} />}>
        {infoLinks.map((link) => (
          <SidebarLinkItem key={link.href} {...link} />
        ))}
        <hr className="mx-2 my-2.5 border-[var(--border-1)]" />
        {detailsLinks.map((link) => (
          <SidebarLinkItem key={link.href} {...link} />
        ))}
        <hr className="m-2 border-[var(--border-2)]" />
        {managingTeamLinks.map((link) => (
          <SidebarLinkItem key={link.href} {...link} />
        ))}
      </Sidebar>
      {children}
      <EventManageSidePanel id={eventManage.id} />
    </>
  );
}
