'use client';

import SegmentedButton from '../../../../components/molecules/Button/SegmentedButton';
import { useEvent } from '../../../../context/navigation';

export type EventManageButtonProps = { slug: string; manage: boolean };
export default function EventManageButton({ slug, manage }: EventManageButtonProps) {
  const { canManage } = useEvent(slug);

  if (manage && !canManage) return null;

  return (
    <SegmentedButton
      className="mx-3 mb-4"
      initialIndex={manage ? 0 : 1}
      options={[
        { label: 'Vue publique', action: `/event/${slug}` },
        { label: 'Vue gestion', action: `/manage/event/${slug}` },
      ]}
    />
  );
}
