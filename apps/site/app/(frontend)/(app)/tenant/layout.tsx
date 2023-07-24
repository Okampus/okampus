'use client';

import TenantManageButton from '../../../../components/layouts/SideBar/ManageButton/TenantManageButton';
import SidebarBanner from '../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../components/molecules/List/LinkList';
import SideBar from '../../../../components/layouts/SideBar';

import { useTenant } from '../../../../context/navigation';
import { getBanner } from '../../../../utils/actor-image/get-banner';

import { IconUsers } from '@tabler/icons-react';

type TenantLayoutProps = { children: React.ReactNode };
export default function TenantLayout({ children }: TenantLayoutProps) {
  const { tenant } = useTenant();

  if (!tenant || !tenant.adminTeam) return null;

  return (
    <>
      <SideBar>
        <SidebarBanner
          name={tenant.adminTeam.actor.name}
          banner={getBanner(tenant.adminTeam.actor.actorImages)?.image.url}
        />
        <TenantManageButton manage={true} />
        <LinkList items={[{ label: 'Présentation', href: `/tenant`, icon: <IconUsers /> }]} />
      </SideBar>
      {children}
    </>
  );
}