import AvatarLabeled from './AvatarLabeled';
import TenantPopoverCard from '../PopoverCard/TenantPopoverCard';
import { getAvatar } from '../../../utils/actor-image/get-avatar';

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
  const adminTeam = tenant?.adminTeam;

  const avatar = getAvatar(adminTeam?.actor?.actorImages)?.image.url;
  const name = adminTeam?.actor.name;

  // TOOD: create a custom popover card for tenant
  const wrapper = ({ children, className }: AvatarWrapperProps) => (
    <TenantPopoverCard triggerClassName={className}>{children}</TenantPopoverCard>
  );
  return (
    <AvatarLabeled
      avatar={avatar}
      type="tenant"
      name={name}
      label={label}
      content={content}
      small={small}
      wrapper={showCardOnClick ? wrapper : undefined}
      skeletonLabelClassName={skeletonClassName}
      className={className}
    />
  );
}
