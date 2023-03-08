import { Skeleton } from '@okampus/ui/atoms';

export function LabeledUserSkeleton() {
  return (
    <div className="flex gap-2 items-center">
      <Skeleton rounded="50%" width={18} height={18} />
      <Skeleton width={60} height={6} />
    </div>
  );
}
