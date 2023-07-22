import SideBar from '../../../../../components/layouts/SideBar';
import TenantManageButton from '../../../../../components/layouts/SideBar/ManageButton/TenantManageButton';
import TenantManageSidePanel from '../../../../../components/layouts/SidePanel/TenantManageSidePanel';
import SidebarBanner from '../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../ssr/getApolloQuery';
import { getBanner } from '../../../../../utils/actor-image/get-banner';

import { tenantManageInfo } from '@okampus/shared/graphql';
import { getTenantFromHost } from '@okampus/shared/utils';

import { IconUsers, IconCheck, IconLayoutGrid, IconTable } from '@tabler/icons-react';
import { headers } from 'next/headers';

import type { TenantManageInfo } from '@okampus/shared/graphql';

const manageTenantRoute = (route: string) => `/manage/tenant/${route}`;

type TenantManageLayoutProps = { children: React.ReactNode };
export default async function TenantManageLayout({ children }: TenantManageLayoutProps) {
  const tenant = getTenantFromHost(headers().get('host') ?? '');

  const query = [{ where: { adminTeam: { actor: { slug: { _eq: tenant } } } }, limit: 1 }, tenantManageInfo];
  const [tenantManage] = await getApolloQuery<TenantManageInfo[]>('tenant', query, true).catch(() => []);

  if (!tenantManage || !tenantManage.adminTeam?.actor) return null;

  return (
    <>
      <ApolloWriteCache values={[[tenantManage, tenantManageInfo]]} />
      <ApolloSubscribe selector={{ tenantByPk: [{ id: tenantManage.id }, tenantManageInfo] }} />
      <SideBar>
        <SidebarBanner
          name={tenantManage.adminTeam.actor.name}
          banner={getBanner(tenantManage.adminTeam.actor.actorImages)?.image?.url}
        />
        <TenantManageButton manage={false} />
        <LinkList
          items={[
            { label: 'Présentation', href: `/manage/tenant`, icon: <IconUsers /> },
            { label: 'Validations', href: manageTenantRoute('validations'), icon: <IconCheck /> },
            { label: 'Dashboard', href: manageTenantRoute('dashboard'), icon: <IconLayoutGrid /> },
            { label: `Bilan ${tenantManage?.pointName}`, href: manageTenantRoute('points'), icon: <IconTable /> },
          ]}
        />
      </SideBar>
      {children}
      <TenantManageSidePanel id={tenantManage.id} />
    </>
  );
}
