import SkeletonPublicSidebar from '../../../../../_components/atoms/Skeleton/SkeletonPublicSidebar';
import Sidebar from '../../../../../_components/layouts/Sidebar';
import TenantManageSidePanel from '../../../../../_components/layouts/SidePanel/TenantManageSidePanel';
import SidebarBanner from '../../../../../_components/layouts/SideBar/SidebarBanner';

import prisma from '../../../../../../database/prisma/db';
import { tenantDetails } from '../../../../../../types/prisma/Tenant/tenant-details';
import SidebarLinkItem from '../../../../../_components/atoms/Item/SidebarLinkItem';
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

import { notFound } from 'next/navigation';
import type { DomainParams } from '../../../../../params.type';

const baseRoute = '/manage/tenant';
const manageTenantRoute = (route: string) => `${baseRoute}/${route}`;

// const SubscribeTenantManageDocument = getSubscriptionFromQuery(GetTenantManageDocument);

export default async function TenantManageLayout({ children, params }: { children: React.ReactNode } & DomainParams) {
  // const { data, errors } = await getApolloQuery<GetTenantManageQuery, GetTenantManageQueryVariables>({
  //   query: GetTenantManageDocument,
  //   variables,
  // }).catch();

  // if (process.env.NODE_ENV !== 'production') console.warn({ data, errors: JSON.stringify(errors) });
  // if (errors) redirect(`/403?message=${JSON.stringify(errors)}`);

  const tenantManage = await prisma.tenant.findFirst({
    where: { domain: params.domain },
    select: tenantDetails.select,
  });

  if (!tenantManage) notFound();

  const tenantLinks = [
    {
      label: 'Personnalisation',
      href: baseRoute,
      icon: <PaintBrush />,
      iconSelected: <PaintBrush weight="fill" />,
    },
    {
      label: 'Campus',
      href: manageTenantRoute('tenant-locations'),
      icon: <Buildings />,
      iconSelected: <Buildings weight="fill" />,
    },
    {
      label: "Validations d'événements",
      href: manageTenantRoute('event-approvals'),
      icon: <CalendarCheck />,
      iconSelected: <CalendarCheck weight="fill" />,
    },
  ];

  const teamLinks = [
    {
      label: 'Associations',
      href: manageTenantRoute('dashboard'),
      icon: <Gauge />,
      iconSelected: <Gauge weight="fill" />,
    },
    {
      label: 'Utilisateurs & rôles',
      href: manageTenantRoute('users'),
      icon: <Users />,
      iconSelected: <Users weight="fill" />,
    },
    {
      label: `Bilan ${tenantManage?.pointName}`,
      href: manageTenantRoute('points'),
      icon: <Table />,
      iconSelected: <Table weight="fill" />,
    },
  ];

  const legalLinks = [
    {
      label: 'Rôles associatifs',
      href: manageTenantRoute('roles'),
      icon: <PersonArmsSpread />,
      iconSelected: <PersonArmsSpread weight="fill" />,
    },
    {
      label: 'Documents à transmettre',
      href: manageTenantRoute('documents'),
      icon: <FileArrowUp />,
      iconSelected: <FileArrowUp weight="fill" />,
    },
  ];

  return tenantManage.actor ? (
    <>
      {/* <ApolloWriteCache values={[[tenantManage, GetTenantManageDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeTenantManageDocument} variables={variables} data-superjson /> */}
      <Sidebar header={<SidebarBanner name={tenantManage.actor.name} src={tenantManage.actor.banner} />}>
        {/* <TenantManageButton manage={false} /> */}
        {tenantLinks.map((link) => (
          <SidebarLinkItem key={link.href} {...link} />
        ))}
        <hr className="mx-2 my-2.5 border-[var(--border-1)]" />
        {teamLinks.map((link) => (
          <SidebarLinkItem key={link.href} {...link} />
        ))}
        <hr className="mx-2 my-2.5 border-[var(--border-1)]" />
        {legalLinks.map((link) => (
          <SidebarLinkItem key={link.href} {...link} />
        ))}
      </Sidebar>
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
