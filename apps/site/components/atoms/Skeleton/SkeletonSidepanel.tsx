import SkeletonLinkItem from './SkeletonLinkItem';
import SidePanel from '../../layouts/SidePanel';

export default function SkeletonSidepanel() {
  return (
    <SidePanel>
      {Array.from({ length: 10 }).map((_, idx) => (
        <SkeletonLinkItem key={idx} />
      ))}
    </SidePanel>
  );
}
