import SidebarLinkItem from '../../../../../../_components/atoms/Item/SidebarLinkItem';
import Sidebar from '../../../../../../_components/layouts/Sidebar';
import SidebarBanner from '../../../../../../_components/layouts/SideBar/SidebarBanner';

// import { getSubscriptionFromQuery } from '../../../../../../../utils/apollo/get-from-query';
import { projectDetails } from '../../../../../../../types/prisma/Project/project-details';
import { urlJoin } from '../../../../../../../utils/url-join';

// import { GetProjectManageDocument } from '@okampus/shared/graphql';
import prisma from '../../../../../../../database/prisma/db';

import { Users, CalendarPlus } from '@phosphor-icons/react/dist/ssr';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../params.type';

export default async function ProjectManageLayout({
  children,
  params,
}: { children: React.ReactNode } & DomainSlugParams) {
  const project = await prisma.project.findFirst({
    where: { slug: params.slug },
    select: projectDetails.select,
  });

  if (!project) notFound();

  const baseRoute = `/project/manage/${params.slug}`;
  const projectManageRoute = (route: string) => urlJoin(baseRoute, route);

  const links = [
    { label: 'Présentation', href: baseRoute, icon: <Users />, iconSelected: <Users weight="fill" /> },
    {
      label: 'Événements',
      href: projectManageRoute('events'),
      icon: <CalendarPlus />,
      iconSelected: <CalendarPlus weight="fill" />,
    },
  ];

  return (
    <>
      <Sidebar header={<SidebarBanner name={project.name} src={project.banner?.url} />}>
        {links.map((link) => (
          <SidebarLinkItem key={link.href} {...link} />
        ))}
      </Sidebar>
      {children}
    </>
  );
}
