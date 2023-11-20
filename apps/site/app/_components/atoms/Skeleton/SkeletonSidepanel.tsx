import SkeletonLinkItem from './SkeletonLinkItem';
import Sidepanel from '../../layouts/Sidepanel';

export default function SkeletonSidepanelWrapper() {
  return (
    <Sidepanel>
      {Array.from({ length: 10 }).map((_, idx) => (
        <SkeletonLinkItem key={idx} />
      ))}
    </Sidepanel>
  );
}
