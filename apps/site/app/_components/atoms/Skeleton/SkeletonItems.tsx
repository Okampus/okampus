import Skeleton from './Skeleton';

export function SkeletonItems() {
  return Array.from({ length: 12 }).map((_, idx) => <Skeleton key={idx} className="w-full h-64" />);
}
