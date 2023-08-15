import Skeleton from './Skeleton';
import SkeletonLinkItem from './SkeletonLinkItem';
import SideBar from '../../layouts/SideBar';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';

export default function SkeletonPublicSidebar() {
  return (
    <SideBar header={<Skeleton className="w-full" style={{ aspectRatio: BANNER_ASPECT_RATIO }} />}>
      <Skeleton className="h-12 w-[calc(100%-1rem)] mx-[0.5rem] mb-3 " />
      {Array.from({ length: 3 }).map((_, idx) => (
        <SkeletonLinkItem key={idx} />
      ))}
    </SideBar>
  );
}
