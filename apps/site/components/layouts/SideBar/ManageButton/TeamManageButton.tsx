'use client';

import SegmentedButton from '../../../../components/molecules/Button/SegmentedButton';
import { useTeam } from '../../../../context/navigation';

export type TeamManageButtonProps = { slug: string; manage: boolean };
export default function TeamManageButton({ slug, manage }: TeamManageButtonProps) {
  const { canManage } = useTeam(slug);

  if (manage && !canManage) return null;

  return (
    <SegmentedButton
      className="mx-3 mb-4"
      initialIndex={manage ? 0 : 1}
      options={[
        { label: 'Vue publique', action: `/team/${slug}` },
        { label: 'Vue gestion', action: `/manage/team/${slug}` },
      ]}
    />
  );
}
