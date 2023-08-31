import SideBar from '../../../../../components/layouts/SideBar';
import SkeletonPublicSidebar from '../../../../../components/atoms/Skeleton/SkeletonPublicSidebar';
import TenantManageButton from '../../../../../components/layouts/SideBar/ManageButton/TenantManageButton';
import TenantManageSidePanel from '../../../../../components/layouts/SidePanel/TenantManageSidePanel';
import SidebarBanner from '../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../utils/apollo/get-from-query';
import { getTenantFromHost } from '../../../../../utils/headers/get-tenant-from-host';

import { GetTenantManageDocument } from '@okampus/shared/graphql';

import { IconCheck, IconLayoutGrid, IconTable, IconBrush } from '@tabler/icons-react';
import { headers } from 'next/headers';

import type { GetTenantManageQuery, GetTenantManageQueryVariables } from '@okampus/shared/graphql';

const manageTenantRoute = (route: string) => `/manage/tenant/${route}`;

const SubscribeTenantManageDocument = getSubscriptionFromQuery(GetTenantManageDocument);

type TenantManageLayoutProps = { children: React.ReactNode };
export default async function TenantManageLayout({ children }: TenantManageLayoutProps) {
  const tenant = getTenantFromHost(headers().get('host') ?? '');
  const variables = { domain: tenant };

  const data = await getApolloQuery<GetTenantManageQuery, GetTenantManageQueryVariables>({
    query: GetTenantManageDocument,
    variables,
  }).catch();

  const tenantManage = data?.tenant[0];

  return tenantManage.adminTeam?.actor ? (
    <>
      <ApolloWriteCache values={[[tenantManage, GetTenantManageDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeTenantManageDocument} variables={variables} data-superjson />
      <SideBar
        header={<SidebarBanner name={tenantManage.adminTeam.actor.name} src={tenantManage.adminTeam.actor.banner} />}
      >
        <TenantManageButton manage={false} />
        <LinkList
          mode="sidebar"
          items={[
            { label: 'Personnalisation', href: `/manage/tenant`, icon: <IconBrush /> },
            { label: 'Validations', href: manageTenantRoute('validations'), icon: <IconCheck /> },
            { label: 'Dashboard', href: manageTenantRoute('dashboard'), icon: <IconLayoutGrid /> },
            { label: `Bilan ${tenantManage?.pointName}`, href: manageTenantRoute('points'), icon: <IconTable /> },
          ]}
        />
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
