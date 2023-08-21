'use client';

import { useTenant } from '../../../../context/navigation';
import { useTranslation } from '../../../../hooks/context/useTranslation';

import clsx from 'clsx';
import Link from 'next/link';

export type TenantManageButtonProps = { manage: boolean };
export default function TenantManageButton({ manage }: TenantManageButtonProps) {
  const { tenant, canManage } = useTenant();
  const { t } = useTranslation();

  if (!tenant || (manage && !canManage)) return null;

  return (
    <Link
      href={manage ? '/manage/tenant' : '/tenant'}
      className={clsx(
        'flex items-center justify-center h-12 w-[calc(100%-1rem)] mb-3 mx-[0.5rem] font-semibold border-2 border-color-1 rounded-md',
        manage ? 'text-0' : 'text-opposite bg-opposite',
      )}
    >
      {t(manage ? 'common.manage.tenant' : 'common.public.tenant')}
    </Link>
  );
}
