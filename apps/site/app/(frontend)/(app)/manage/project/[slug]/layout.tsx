import SideBar from '../../../../../_components/layouts/SideBar';
import ProjectManageButton from '../../../../../_components/layouts/SideBar/ManageButton/ProjectManageButton';
import SidebarBanner from '../../../../../_components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../_components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../_components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../_components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../../server/ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../../utils/apollo/get-from-query';
import { urlJoin } from '../../../../../../utils/url-join';

import { GetProjectManageDocument } from '@okampus/shared/graphql';
import { Users, CalendarPlus } from '@phosphor-icons/react/dist/ssr';
import { redirect } from 'next/navigation';

import type { GetProjectManageQuery, GetProjectQueryVariables } from '@okampus/shared/graphql';

const SubscribeProjectManageDocument = getSubscriptionFromQuery(GetProjectManageDocument);

type ProjectManageLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ProjectManageLayout({ children, params }: ProjectManageLayoutProps) {
  const variables = { slug: params.slug };
  const { data, errors } = await getApolloQuery<GetProjectManageQuery, GetProjectQueryVariables>({
    query: GetProjectManageDocument,
    variables,
  });

  if (errors) redirect(`/403?message=${JSON.stringify(errors)}`); // TODO: keep url but display error message?

  const project = data.project[0];

  const baseRoute = `/project/manage/${params.slug}`;
  const projectManageRoute = (route: string) => urlJoin(baseRoute, route);
  return (
    <>
      <ApolloWriteCache values={[[project, GetProjectManageDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeProjectManageDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={project.name} src={project.banner?.url} />}>
        <ProjectManageButton slug={params.slug} manage={true} />
        <LinkList
          mode="sidebar"
          items={[
            { label: 'Présentation', href: baseRoute, icon: <Users /> },
            { label: 'Événements', href: projectManageRoute('events'), icon: <CalendarPlus /> },
          ]}
        />
      </SideBar>
      {children}
    </>
  );
}
