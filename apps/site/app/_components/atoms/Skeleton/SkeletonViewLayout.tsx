import Skeleton from './Skeleton';
import ViewLayout from '../Layout/ViewLayout';

export default function SkeletonViewLayout() {
  return (
    <ViewLayout header={null}>
      <Skeleton className="h-full w-full" />
    </ViewLayout>
  );
}
