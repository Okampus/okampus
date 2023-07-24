import AvatarLabeled from './AvatarLabeled';
import TeamPopoverCard from '../PopoverCard/TeamPopoverCard';
import { getAvatar } from '../../../utils/actor-image/get-avatar';
import { TeamType } from '@okampus/shared/enums';

import type { AvatarWrapperProps } from './AvatarLabeled';
import type { TenantDetailsInfo } from '@okampus/shared/graphql';

export type TenantLabeledProps = {
  tenant?: TenantDetailsInfo;
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
  const adminTeam = tenant?.tenantOrganizes.find(
    (manage) => !manage.campusCluster && manage.team.type === TeamType.Tenant
  )?.team;

  const avatar = getAvatar(adminTeam?.actor?.actorImages)?.image.url;
  const name = adminTeam?.actor?.name;

  // TOOD: create a custom popover card for tenant
  const wrapper = ({ children, className }: AvatarWrapperProps) => (
    <TeamPopoverCard teamId={adminTeam?.id} triggerClassName={className}>
      {children}
    </TeamPopoverCard>
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
