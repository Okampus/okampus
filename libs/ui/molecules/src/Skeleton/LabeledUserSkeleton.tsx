import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { Skeleton } from '@okampus/ui/atoms';

export function LabeledUserSkeleton() {
  return (
    <div className="flex gap-2 items-center">
      <Skeleton rounded={`${AVATAR_USER_ROUNDED}%`} width={18} height={18} />
      <Skeleton width={60} height={6} />
    </div>
  );
}
