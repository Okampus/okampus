'use client';

import SegmentedButton from '../../../../components/molecules/Button/SegmentedButton';
import { useTenant } from '../../../../context/navigation';

export type TenantManageButtonProps = { manage: boolean };
export default function TenantManageButton({ manage }: TenantManageButtonProps) {
  const { canManage } = useTenant();

  if (manage && !canManage) return null;

  return (
    <SegmentedButton
      className="mx-3 mb-4"
      initialIndex={manage ? 0 : 1}
      options={[
        { label: 'Vue publique', action: '/tenant' },
        { label: 'Vue gestion', action: '/manage/tenant' },
      ]}
    />
  );
}
