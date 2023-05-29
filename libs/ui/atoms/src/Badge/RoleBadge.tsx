import { Skeleton } from '../Skeleton/Skeleton';
import { TEAM_ROLE_CATEGORY_COLORS } from '@okampus/shared/consts';
import { clsx } from 'clsx';

import type { RoleCategory } from '@okampus/shared/enums';
import type { RoleBaseInfo } from '@okampus/shared/graphql';

export type RoleBadgeProps = { role?: RoleBaseInfo; className?: string };
export function RoleBadge({ role, className }: RoleBadgeProps) {
  const color = TEAM_ROLE_CATEGORY_COLORS[role?.category as RoleCategory];
  return role ? (
    <div style={{ color }} className={clsx('font-semibold text-2 font-heading', className)}>
      {role.name}
    </div>
  ) : (
    <Skeleton height={3} width={20} />
  );
}
