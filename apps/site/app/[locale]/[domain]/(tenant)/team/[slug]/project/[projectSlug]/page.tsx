import SidebarLinkItem from '../../../../../../../_components/atoms/Item/SidebarLinkItem';
import Sidebar from '../../../../../../../_components/layouts/Sidebar';
import SidebarBanner from '../../../../../../../_components/layouts/SideBar/SidebarBanner';

import prisma from '../../../../../../../../database/prisma/db';

import { projectMinimal } from '../../../../../../../../types/prisma/Project/project-minimal';

import { Users, CalendarPlus } from '@phosphor-icons/react/dist/ssr';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../../params.type';

export type ProjectParams = { params: DomainSlugParams['params'] & { projectSlug: string } };
export default async function ProjectPage({ params }: ProjectParams) {
  const project = await prisma.project.findFirst({
    where: { slug: params.projectSlug, team: { slug: params.slug }, tenantScope: { domain: params.domain } },
    select: projectMinimal.select,
  });

  if (!project) notFound();

  const baseRoute = `/project/${project.slug}`;
  const projectRoute = (route: string) => `${baseRoute}/${route}`;

  const links = [
    { label: 'Présentation', href: baseRoute, icon: <Users />, iconSelected: <Users weight="fill" /> },
    {
      label: 'Événements',
      href: projectRoute('events'),
      icon: <CalendarPlus />,
      iconSelected: <CalendarPlus weight="fill" />,
    },
  ];

  return (
    <>
      <Sidebar header={<SidebarBanner name={project.name} src={project.banner?.url} />}>
        {/* <ProjectManageButton slug={params.slug} manage={true} /> */}
        {links.map((link) => (
          <SidebarLinkItem key={link.href} {...link} />
        ))}
      </Sidebar>
      {/* TODO: project presentation */}
      {/* <div>My Post {params.slug}</div> */}
    </>
  );
}
