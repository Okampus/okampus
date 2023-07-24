import SideBar from '../../../../../../components/layouts/SideBar';
import ProjectManageButton from '../../../../../../components/layouts/SideBar/ManageButton/ProjectManageButton';
import SidebarBanner from '../../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../../components/wrappers/ApolloWriteCache';
import { getApolloQuery } from '../../../../../../ssr/getApolloQuery';

import { projectManageInfo } from '@okampus/shared/graphql';
import { IconUsers, IconCalendarCog } from '@tabler/icons-react';

import type { ProjectManageInfo } from '@okampus/shared/graphql';

type ProjectManageLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ProjectManageLayout({ children, params }: ProjectManageLayoutProps) {
  const query = [{ where: { slug: { _eq: params.slug } }, limit: 1 }, projectManageInfo];
  const [project] = await getApolloQuery<ProjectManageInfo[]>('project', query, true).catch(() => []);

  if (!project) return null;

  const baseRoute = `/project/manage/${params.slug}`;
  const projectManageRoute = (route: string) => `${baseRoute}/${route}`;
  return (
    <>
      <ApolloWriteCache values={[[project, projectManageInfo]]} />
      <ApolloSubscribe selector={{ projectByPk: [{ id: project.id }, projectManageInfo] }} />
      <SideBar>
        <SidebarBanner name={project.name} banner={project.banner?.url} />
        <ProjectManageButton slug={params.slug} manage={true} />
        <LinkList
          items={[
            { label: 'Présentation', href: baseRoute, icon: <IconUsers /> },
            { label: 'Événements', href: projectManageRoute('events'), icon: <IconCalendarCog /> },
          ]}
        />
      </SideBar>
      {children}
    </>
  );
}
