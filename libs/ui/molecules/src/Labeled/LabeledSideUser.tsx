import { UserPopoverCard } from '../PopoverCard/UserPopoverCard';

import { AvatarImage } from '@okampus/ui/atoms';
import { getAvatar } from '@okampus/ui/utils';

import type { TeamMemberWithUser } from '@okampus/shared/graphql';

export type LabelSideUserOptions = {
  teamMember: TeamMemberWithUser;
};

export function LabeledSideUser({ teamMember }: LabelSideUserOptions) {
  if (!teamMember.user) return null;

  const avatar = getAvatar(teamMember.user.individual?.actor?.actorImages);
  return (
    <UserPopoverCard userId={teamMember.user.id} triggerClassName="w-full rounded-lg">
      <div className="flex gap-item items-center p-2 bg-1-hover rounded-lg text-1 text-0-hover font-semibold">
        <AvatarImage src={avatar} name={teamMember.user.individual?.actor?.name} size={17} type="user" />
        <div className="line-clamp-1">{teamMember.user.individual?.actor?.name}</div>
      </div>
    </UserPopoverCard>
  );
}
