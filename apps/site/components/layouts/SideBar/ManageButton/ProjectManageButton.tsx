'use client';

import { useProject } from '../../../../context/navigation';
import { useTranslation } from '../../../../hooks/context/useTranslation';

import clsx from 'clsx';
import Link from 'next/link';

export type ProjectManageButtonProps = { slug: string; manage: boolean };
export default function ProjectManageButton({ slug, manage }: ProjectManageButtonProps) {
  const { project, canManage } = useProject(slug);
  const { t } = useTranslation();

  if (!project || (manage && !canManage)) return null;

  return (
    <Link
      href={manage ? `/manage/project/${slug}` : `/project/${slug}`}
      className={clsx(
        'flex items-center justify-center h-12 w-[calc(100%-1rem)] mb-3 mx-[0.5rem] font-semibold border-2 border-color-1 rounded-md',
        manage ? 'text-0' : 'text-opposite bg-opposite',
      )}
    >
      {t(manage ? 'common.manage.project' : 'common.public.project')}
    </Link>
  );
}
