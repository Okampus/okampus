import SimpleList from '../../../../../components/molecules/List/SimpleList';
import SkeletonPublicSidebar from '../../../../../components/atoms/Skeleton/SkeletonPublicSidebar';
import SideBar from '../../../../../components/layouts/SideBar';
import TenantManageButton from '../../../../../components/layouts/SideBar/ManageButton/TenantManageButton';
import TenantManageSidePanel from '../../../../../components/layouts/SidePanel/TenantManageSidePanel';
import SidebarBanner from '../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../utils/apollo/get-from-query';
import { getTenantFromHost } from '../../../../../utils/host/get-tenant-from-host';

import { GetTenantManageDocument } from '@okampus/shared/graphql';

import {
  IconLayoutGrid,
  IconTable,
  IconBrush,
  IconUsers,
  IconBuilding,
  IconCalendarCheck,
  IconUserCheck,
  IconStack2,
} from '@tabler/icons-react';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { GetTenantManageQuery, GetTenantManageQueryVariables } from '@okampus/shared/graphql';

const manageTenantRoute = (route: string) => `/manage/tenant/${route}`;

const SubscribeTenantManageDocument = getSubscriptionFromQuery(GetTenantManageDocument);

type TenantManageLayoutProps = { children: React.ReactNode };
export default async function TenantManageLayout({ children }: TenantManageLayoutProps) {
  const tenant = getTenantFromHost(headers().get('host') ?? '');
  const variables = { domain: tenant };

  const { data, errors } = await getApolloQuery<GetTenantManageQuery, GetTenantManageQueryVariables>({
    query: GetTenantManageDocument,
    variables,
  }).catch();

  if (errors) redirect(`/403?message=${JSON.stringify(errors)}`);

  const tenantManage = data.tenant[0];

  return tenantManage.actor ? (
    <>
      <ApolloWriteCache values={[[tenantManage, GetTenantManageDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeTenantManageDocument} variables={variables} data-superjson />
      <SideBar header={<SidebarBanner name={tenantManage.actor.name} src={tenantManage.actor.banner} />}>
        <TenantManageButton manage={false} />
        <SimpleList heading="Gestion" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Personnalisation', href: `/manage/tenant`, icon: <IconBrush /> },
              { label: 'Campus', href: manageTenantRoute('campus'), icon: <IconBuilding /> },
              {
                label: "Validations d'événements",
                href: manageTenantRoute('event-approvals'),
                icon: <IconCalendarCheck />,
              },
            ]}
          />
        </SimpleList>
        <hr className="mx-2 my-2.5 border-[var(--border-1)]" />
        <SimpleList heading="Récapitulatifs" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Associations', href: manageTenantRoute('dashboard'), icon: <IconLayoutGrid /> },
              { label: 'Utilisateurs & rôles', href: manageTenantRoute('users'), icon: <IconUsers /> },
              { label: `Bilan ${tenantManage?.pointName}`, href: manageTenantRoute('points'), icon: <IconTable /> },
            ]}
          />
        </SimpleList>
        <hr className="mx-2 my-2.5 border-[var(--border-1)]" />
        <SimpleList heading="Règles associatves" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Rôles associatifs', href: manageTenantRoute('roles'), icon: <IconUserCheck /> },
              { label: 'Documents à transmettre', href: manageTenantRoute('documents'), icon: <IconStack2 /> },
            ]}
          />
        </SimpleList>
      </SideBar>
      {children}
      <TenantManageSidePanel id={tenantManage.id} />
    </>
  ) : (
    <>
      <SkeletonPublicSidebar />
      {children}
    </>
  );
}
