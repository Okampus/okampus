'use client';

import { useTeam } from '../../../../context/navigation';
import { useTranslation } from '../../../../hooks/context/useTranslation';

import clsx from 'clsx';
import Link from 'next/link';

export type TeamManageButtonProps = { slug: string; manage: boolean };
export default function TeamManageButton({ slug, manage }: TeamManageButtonProps) {
  const { team, canManage } = useTeam(slug);
  const { t } = useTranslation();

  if (!team || (manage && !canManage)) return null;

  return (
    <Link
      href={manage ? `/manage/team/${slug}` : `/team/${slug}`}
      className={clsx(
        'rounded-md flex items-center justify-center h-12 w-[calc(100%-1rem)] mb-3 mx-[0.5rem] font-semibold border-2 border-color-1',
        manage ? 'text-0' : 'text-opposite bg-opposite',
      )}
    >
      {t(manage ? 'common.manage.team' : 'common.public.team')}
    </Link>
  );
}
