import SideBar from '../../../../../components/layouts/SideBar';
import ProjectManageButton from '../../../../../components/layouts/SideBar/ManageButton/ProjectManageButton';
import SidebarBanner from '../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../utils/apollo/get-from-query';

import { GetProjectDocument } from '@okampus/shared/graphql';

import { IconUsers, IconCalendarCog } from '@tabler/icons-react';
import { redirect } from 'next/navigation';

import type { GetProjectQuery, GetProjectQueryVariables } from '@okampus/shared/graphql';

const SubscribeProjectDocument = getSubscriptionFromQuery(GetProjectDocument);

type ProjectLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const variables = { slug: params.slug };
  const { data, errors } = await getApolloQuery<GetProjectQuery, GetProjectQueryVariables>({
    query: GetProjectDocument,
    variables,
  });

  if (errors) redirect(`/403?message=${JSON.stringify(errors)}`);

  const project = data.project[0];

  const baseRoute = `/project/${params.slug}`;
  const projectRoute = (route: string) => `${baseRoute}/${route}`;
  return (
    <>
      <ApolloWriteCache values={[[project, GetProjectDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeProjectDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={project.name} src={project.banner?.url} />}>
        <ProjectManageButton slug={params.slug} manage={true} />
        <LinkList
          mode="sidebar"
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
