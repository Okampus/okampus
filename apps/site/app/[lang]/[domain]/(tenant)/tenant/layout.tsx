'use client';

import TenantManageButton from '../../../../_components/layouts/SideBar/ManageButton/TenantManageButton';
import SidebarBanner from '../../../../_components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../_components/molecules/List/LinkList';
import SkeletonPublicSidebar from '../../../../_components/atoms/Skeleton/SkeletonPublicSidebar';
import SideBar from '../../../../_components/layouts/SideBar';

import { useTenant } from '../../../../_context/navigation';

import { Users } from '@phosphor-icons/react';

type TenantLayoutProps = { children: React.ReactNode };
export default function TenantLayout({ children }: TenantLayoutProps) {
  const { tenant } = useTenant();

  if (!tenant)
    return (
      <>
        <SkeletonPublicSidebar />
        {children}
      </>
    );

  return (
    <>
      <SideBar header={<SidebarBanner name={tenant.actor.name} src={tenant.actor.banner} />}>
        <TenantManageButton manage={true} />
        <LinkList mode="sidebar" items={[{ label: 'Présentation', href: `/tenant`, icon: <Users /> }]} />
      </SideBar>
      {children}
    </>
  );
}
