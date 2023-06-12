import { UserPopoverCard } from '../PopoverCard/UserPopoverCard';

import { AvatarImage } from '@okampus/ui/atoms';
import { getAvatar } from '@okampus/ui/utils';

import type { TeamMemberWithUserInfo } from '@okampus/shared/graphql';

export type LabelSideUserInfoOptions = {
  teamMember: TeamMemberWithUserInfo;
};

export function LabeledSideUser({ teamMember }: LabelSideUserInfoOptions) {
  if (!teamMember.userInfo) return null;

  const avatar = getAvatar(teamMember.userInfo.individualById?.actor?.actorImages);
  return (
    <UserPopoverCard userId={teamMember.userInfo.id} triggerClassName="w-full rounded-lg">
      <div className="flex gap-item items-center p-2 bg-1-hover rounded-lg text-1 text-0-hover font-semibold">
        <AvatarImage src={avatar} name={teamMember.userInfo.individualById?.actor?.name} size={17} type="user" />
        <div className="line-clamp-1">{teamMember.userInfo.individualById?.actor?.name}</div>
      </div>
    </UserPopoverCard>
  );
}
