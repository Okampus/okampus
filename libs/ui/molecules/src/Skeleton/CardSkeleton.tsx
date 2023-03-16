import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { Skeleton } from '@okampus/ui/atoms';

export function CardSkeleton() {
  return (
    <div className="flex flex-col w-80 rounded-xl overflow-hidden">
      <div className="h-24 bg-0" />
      <div className="bg-1 text-0 px-4 pb-2 relative flex flex-col gap-1">
        <Skeleton
          height={34}
          width={34}
          rounded={`${AVATAR_USER_ROUNDED}`}
          className="absolute -translate-y-[50%] border-4 border-[var(--bg-1)]"
        />
        <Skeleton height={10} width={72} className="-mt-4" />
        <hr className="my-1 border-color-3" />
        <Skeleton height={6} width={32} />
      </div>
    </div>
  );
}
