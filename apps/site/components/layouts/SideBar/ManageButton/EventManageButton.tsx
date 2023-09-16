'use client';

import SegmentedButton from '../../../../components/molecules/Button/SegmentedButton';
import { useEvent } from '../../../../context/navigation';

export type EventManageButtonProps = { slug: string; manage: boolean };
export default function EventManageButton({ slug, manage }: EventManageButtonProps) {
  const { canManage } = useEvent(slug);

  console.log('Manage button', { canManage });
  if (manage && !canManage) return null;

  return (
    <SegmentedButton
      className="mx-3 mb-4"
      initialIndex={manage ? 0 : 1}
      options={[
        { label: 'Voir', action: `/event/${slug}` },
        { label: 'Gérer', action: `/manage/event/${slug}` },
      ]}
    />
  );
}
