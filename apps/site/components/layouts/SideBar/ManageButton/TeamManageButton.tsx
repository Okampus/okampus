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
        { label: 'Voir', action: `/team/${slug}` },
        { label: 'Gérer', action: `/manage/team/${slug}` },
      ]}
    />
  );
}
