import SideBar from '../../../../../components/layouts/SideBar';
import ProjectManageButton from '../../../../../components/layouts/SideBar/ManageButton/ProjectManageButton';
import SidebarBanner from '../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../ssr/getApolloQuery';

import { projectBaseInfo } from '@okampus/shared/graphql';
import { IconUsers, IconCalendarCog } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import type { ProjectBaseInfo } from '@okampus/shared/graphql';

type ProjectLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const query = [{ where: { slug: { _eq: params.slug } }, limit: 1 }, projectBaseInfo];
  const [project] = await getApolloQuery<ProjectBaseInfo[]>('project', query, true).catch(() => []);

  if (!project) notFound();

  const baseRoute = `/project/${params.slug}`;
  const projectRoute = (route: string) => `${baseRoute}/${route}`;
  return (
    <>
      <ApolloWriteCache values={[[project, projectBaseInfo]]} />
      <ApolloSubscribe selector={{ projectByPk: [{ id: project.id }, projectBaseInfo] }} />
      <SideBar header={<SidebarBanner name={project.name} banner={project.banner?.url} />}>
        <ProjectManageButton slug={params.slug} manage={true} />
        <LinkList
          items={[
            { label: 'Présentation', href: baseRoute, icon: <IconUsers /> },
            { label: 'Événements', href: projectRoute('events'), icon: <IconCalendarCog /> },
          ]}
        />
      </SideBar>
      {children}
    </>
  );
}
