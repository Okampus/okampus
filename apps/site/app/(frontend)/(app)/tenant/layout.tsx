'use client';

import TenantManageButton from '../../../../components/layouts/SideBar/ManageButton/TenantManageButton';
import SidebarBanner from '../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../components/molecules/List/LinkList';
import SkeletonPublicSidebar from '../../../../components/atoms/Skeleton/SkeletonPublicSidebar';
import SideBar from '../../../../components/layouts/SideBar';

import { useTenant } from '../../../../context/navigation';

import { IconUsers } from '@tabler/icons-react';

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
        <LinkList mode="sidebar" items={[{ label: 'Présentation', href: `/tenant`, icon: <IconUsers /> }]} />
      </SideBar>
      {children}
    </>
  );
}
