import Skeleton from './Skeleton';

export default function SkeletonLinkItem() {
  return (
    <span className="w-full flex items-center gap-2.5 px-3 py-2 text-2 min-h-[2rem]">
      <Skeleton className="w-6 h-6 rounded-lg shrink-0" />
      <Skeleton className="w-full h-4 rounded-lg" />
    </span>
  );
}
