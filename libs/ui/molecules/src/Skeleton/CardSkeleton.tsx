import { Skeleton } from '@okampus/ui/atoms';

export function CardSkeleton() {
  return (
    <div className="flex flex-col w-[22rem] rounded-lg overflow-hidden">
      <div className="h-24 bg-0" />
      <div className="bg-1 text-0 p-4 relative flex flex-col gap-1">
        <Skeleton
          height={34}
          width={34}
          className="absolute -translate-y-[50%] border-4 border-[var(--bg-1)] rounded-[50%]"
        />
        <Skeleton height={10} width={72} className="-mt-4" />
        <hr className="my-1 border-color-3" />
        <Skeleton height={6} width={32} />
      </div>
    </div>
  );
}
