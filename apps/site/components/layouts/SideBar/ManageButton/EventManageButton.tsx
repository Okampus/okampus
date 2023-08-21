'use client';

import { useEvent } from '../../../../context/navigation';
import { useTranslation } from '../../../../hooks/context/useTranslation';

import clsx from 'clsx';
import Link from 'next/link';

export type EventManageButtonProps = { slug: string; manage: boolean };
export default function EventManageButton({ slug, manage }: EventManageButtonProps) {
  const { event, canManage } = useEvent(slug);
  const { t } = useTranslation();

  if (!event || (manage && !canManage)) return null;

  return (
    <Link
      href={manage ? `/manage/event/${slug}` : `/event/${slug}`}
      className={clsx(
        'flex items-center justify-center h-12 w-[calc(100%-1rem)] mb-3 mx-[0.5rem] font-semibold border-2 border-color-1 rounded-md',
        manage ? 'text-0' : 'text-opposite bg-opposite',
      )}
    >
      {t(manage ? 'common.manage.event' : 'common.public.event')}
    </Link>
  );
}
