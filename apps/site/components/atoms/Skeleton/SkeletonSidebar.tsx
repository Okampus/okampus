import SkeletonLinkItem from './SkeletonLinkItem';
import SideBar from '../../layouts/SideBar';

export default function SkeletonSidebar() {
  return (
    <SideBar>
      {Array.from({ length: 10 }).map((_, idx) => (
        <SkeletonLinkItem key={idx} />
      ))}
    </SideBar>
  );
}
