import SideBar from '../../../../../../components/layouts/SideBar';
import ProjectManageButton from '../../../../../../components/layouts/SideBar/ManageButton/ProjectManageButton';
import SidebarBanner from '../../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../../ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../../utils/apollo/get-from-query';

import { GetProjectManageDocument } from '@okampus/shared/graphql';
import { IconUsers, IconCalendarCog } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import type { GetProjectManageQuery, GetProjectQueryVariables } from '@okampus/shared/graphql';

const SubscribeProjectManageDocument = getSubscriptionFromQuery(GetProjectManageDocument);

type ProjectManageLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ProjectManageLayout({ children, params }: ProjectManageLayoutProps) {
  const variables = { slug: params.slug };
  const data = await getApolloQuery<GetProjectManageQuery, GetProjectQueryVariables>({
    query: GetProjectManageDocument,
    variables,
  }).catch();

  const project = data.project[0];
  if (!project) notFound();

  const baseRoute = `/project/manage/${params.slug}`;
  const projectManageRoute = (route: string) => `${baseRoute}/${route}`;
  return (
    <>
      <ApolloWriteCache values={[[project, GetProjectManageDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeProjectManageDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={project.name} src={project.banner?.url} />}>
        <ProjectManageButton slug={params.slug} manage={true} />
        <LinkList
          mode="sidebar"
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
