import SimpleList from '../../../../_components/molecules/List/SimpleList';
import SkeletonPublicSidebar from '../../../../_components/atoms/Skeleton/SkeletonPublicSidebar';
import SideBar from '../../../../_components/layouts/SideBar';
import TenantManageButton from '../../../../_components/layouts/SideBar/ManageButton/TenantManageButton';
import TenantManageSidePanel from '../../../../_components/layouts/SidePanel/TenantManageSidePanel';
import SidebarBanner from '../../../../_components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../_components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../_components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../_components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../server/ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../utils/apollo/get-from-query';
import { getTenantFromHost } from '../../../../../utils/host/get-tenant-from-host';

import { GetTenantManageDocument } from '@okampus/shared/graphql';

import {
  Gauge,
  Table,
  PaintBrush,
  Users,
  Buildings,
  CalendarCheck,
  PersonArmsSpread,
  FileArrowUp,
} from '@phosphor-icons/react/dist/ssr';

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

  if (process.env.NODE_ENV === 'development') console.warn({ data, errors: JSON.stringify(errors) });
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
              { label: 'Personnalisation', href: `/manage/tenant`, icon: <PaintBrush /> },
              { label: 'Campus', href: manageTenantRoute('campus'), icon: <Buildings /> },
              {
                label: "Validations d'événements",
                href: manageTenantRoute('event-approvals'),
                icon: <CalendarCheck />,
              },
            ]}
          />
        </SimpleList>
        <hr className="mx-2 my-2.5 border-[var(--border-1)]" />
        <SimpleList heading="Récapitulatifs" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Associations', href: manageTenantRoute('dashboard'), icon: <Gauge /> },
              { label: 'Utilisateurs & rôles', href: manageTenantRoute('users'), icon: <Users /> },
              { label: `Bilan ${tenantManage?.pointName}`, href: manageTenantRoute('points'), icon: <Table /> },
            ]}
          />
        </SimpleList>
        <hr className="mx-2 my-2.5 border-[var(--border-1)]" />
        <SimpleList heading="Règles associatves" headingClassName="ml-3">
          <LinkList
            mode="sidebar"
            items={[
              { label: 'Rôles associatifs', href: manageTenantRoute('roles'), icon: <PersonArmsSpread /> },
              { label: 'Documents à transmettre', href: manageTenantRoute('documents'), icon: <FileArrowUp /> },
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
