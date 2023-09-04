import AvatarLabeled from './AvatarLabeled';
import TenantPopoverCard from '../PopoverCard/TenantPopoverCard';

import type { AvatarWrapperProps } from './AvatarLabeled';
import type { TenantMinimalInfo } from '../../../types/features/tenant.info';

export type TenantLabeledProps = {
  tenant?: TenantMinimalInfo;
  label?: React.ReactNode;
  content?: React.ReactNode;
  small?: boolean;
  showCardOnClick?: boolean;
  skeletonClassName?: string;
  className?: string;
};

export default function TenantLabeled({
  tenant,
  label,
  content,
  small,
  showCardOnClick = true,
  skeletonClassName,
  className,
}: TenantLabeledProps) {
  // TOOD: create a custom popover card for tenant
  const wrapper = ({ children, className }: AvatarWrapperProps) => (
    <TenantPopoverCard triggerClassName={className}>{children}</TenantPopoverCard>
  );
  return (
    <AvatarLabeled
      type="team"
      avatar={tenant?.actor.avatar}
      name={tenant?.actor.name}
      label={label}
      content={content}
      small={small}
      wrapper={showCardOnClick ? wrapper : undefined}
      skeletonLabelClassName={skeletonClassName}
      className={className}
    />
  );
}
