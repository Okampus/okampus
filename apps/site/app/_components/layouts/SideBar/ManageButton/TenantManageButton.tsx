'use client';

import SegmentedButton from '../../../../_components/molecules/Button/SegmentedButton';
import { useTenant } from '../../../../_context/navigation';

export type TenantManageButtonProps = { manage: boolean };
export default function TenantManageButton({ manage }: TenantManageButtonProps) {
  const { canManage } = useTenant();

  if (manage && !canManage) return null;

  return (
    <SegmentedButton
      className="mx-3 mb-4"
      initialIndex={manage ? 0 : 1}
      options={[
        { label: 'Voir', action: '/tenant' },
        { label: 'Gérer', action: '/manage/tenant' },
      ]}
    />
  );
}
