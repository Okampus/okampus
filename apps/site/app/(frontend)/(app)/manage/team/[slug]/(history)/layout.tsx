'use client';

import SkeletonSidepanel from '../../../../../../../components/atoms/Skeleton/SkeletonSidepanel';
import TeamManageSidePanel from '../../../../../../../components/layouts/SidePanel/TeamManageSidePanel';
import { useTeamManage } from '../../../../../../../context/navigation';

type ManageTeamLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default function ManageTeamLayout({ children, params }: ManageTeamLayoutProps) {
  const { teamManage } = useTeamManage(params.slug);

  if (!teamManage)
    return (
      <>
        {children}
        <SkeletonSidepanel />
      </>
    );

  return (
    <>
      {children}
      <TeamManageSidePanel id={teamManage.id} />
    </>
  );
}
