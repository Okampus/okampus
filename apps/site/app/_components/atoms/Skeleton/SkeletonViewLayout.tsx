import Skeleton from './Skeleton';
import BaseView from '../../templates/BaseView';

export default function SkeletonViewLayout() {
  return (
    <BaseView header={null}>
      <Skeleton className="h-full w-full" />
    </BaseView>
  );
}
