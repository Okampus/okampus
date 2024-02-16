'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

const separatorClassName =
  'before:h-[1px] before:flex-1 before:bg-gray-200 after:h-[1px] after:flex-1 after:bg-gray-200';

export default function OrSeparator() {
  const t = useTranslations();

  return (
    <div className={clsx('flex items-center gap-4 text-2 font-medium uppercase my-6', separatorClassName)}>
      {t('Common.Or')}
    </div>
  );
}
