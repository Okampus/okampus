import { Skeleton } from '@okampus/ui/atoms';

export function LabeledTeamSkeleton() {
  return (
    <div className="flex gap-2 items-center">
      <Skeleton rounded="50%" width={18} height={18} />
      <div className="flex flex-col gap-1">
        <Skeleton width={72} height={6} />
        <Skeleton width={18} height={6} />
      </div>
    </div>
  );
}
