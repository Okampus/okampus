import Skeleton from './Skeleton';
import SkeletonLinkItem from './SkeletonLinkItem';
import SideBar from '../../layouts/SideBar';

export default function SkeletonManageSidebar() {
  return (
    <SideBar header={<Skeleton className="h-12 w-[calc(100%-1rem)] mx-[0.5rem] mb-3" />}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <SkeletonLinkItem key={idx} />
      ))}
    </SideBar>
  );
}
