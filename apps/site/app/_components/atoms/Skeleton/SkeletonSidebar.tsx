import SkeletonLinkItem from './SkeletonLinkItem';
import Sidebar from '../../layouts/Sidebar';

export default function SkeletonSidebar() {
  return (
    <Sidebar>
      {Array.from({ length: 10 }).map((_, idx) => (
        <SkeletonLinkItem key={idx} />
      ))}
    </Sidebar>
  );
}
