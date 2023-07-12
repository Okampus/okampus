import { UserPopoverCard } from '../PopoverCard/UserPopoverCard';
import { AvatarImage } from '@okampus/ui/atoms';
import clsx from 'clsx';

import type { AvatarImageProps } from '@okampus/ui/atoms';

export type UserLabelProps = {
  name: string;
  subtitle?: React.ReactNode;
  id: string;
  avatar?: { src?: AvatarImageProps['src']; size?: AvatarImageProps['size'] };
  className?: string;
  labelClassName?: string;
  ellipsis?: boolean;
};

export function LabeledUser({
  name,
  subtitle,
  id,
  avatar,
  className = 'gap-2',
  labelClassName,
  ellipsis,
}: UserLabelProps) {
  return (
    <div className={clsx('flex items-center font-semibold text-hover contrast-hover text-1', className)}>
      <UserPopoverCard userId={id}>
        <AvatarImage src={avatar?.src} name={name} size={avatar?.size ?? 18} type="user" />
      </UserPopoverCard>

      <UserPopoverCard userId={id}>
        <div className="flex flex-col items-start leading-none text-lg">
          <div className={clsx(ellipsis ? 'line-clamp-1' : 'shrink-0', labelClassName)}>{name}</div>
          {subtitle}
        </div>
      </UserPopoverCard>
    </div>
  );
}
