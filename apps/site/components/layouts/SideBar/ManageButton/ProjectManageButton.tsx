'use client';

import SegmentedButton from '../../../../components/molecules/Button/SegmentedButton';
import { useProject } from '../../../../context/navigation';

export type ProjectManageButtonProps = { slug: string; manage: boolean };
export default function ProjectManageButton({ slug, manage }: ProjectManageButtonProps) {
  const { canManage } = useProject(slug);

  if (manage && !canManage) return null;

  return (
    <SegmentedButton
      className="mx-3 mb-4"
      initialIndex={manage ? 0 : 1}
      options={[
        { label: 'Vue publique', action: `/project/${slug}` },
        { label: 'Vue gestion', action: `/manage/project/${slug}` },
      ]}
    />
  );
}
