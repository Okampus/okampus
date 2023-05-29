import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { ApprovalState } from '@okampus/shared/enums';
import { AvatarImage, RoleBadge } from '@okampus/ui/atoms';
import { getAvatar } from '@okampus/ui/utils';

import { ReactComponent as TimeOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/time.svg';
import { ReactComponent as CheckCircleFilledIcon } from '@okampus/assets/svg/icons/material/filled/check-circle.svg';
import { ReactComponent as CloseCircleFilledIcon } from '@okampus/assets/svg/icons/material/filled/close-circle.svg';
import { ReactComponent as CanceledFilledIcon } from '@okampus/assets/svg/icons/material/filled/cancel.svg';
import type { TeamJoinWithUserInfo } from '@okampus/shared/graphql';

export type LabeledTeamJoinProps = {
  teamJoin: TeamJoinWithUserInfo;
  onClick: () => void;
};

export function LabeledTeamJoin({ teamJoin, onClick }: LabeledTeamJoinProps) {
  return (
    <div className="flex justify-between text-0 p-3 rounded-lg bg-1-hover cursor-pointer " onClick={onClick}>
      <div className="flex gap-item">
        <AvatarImage
          size={22}
          src={getAvatar(teamJoin.userInfo.individualById?.actor?.actorImages)}
          name={teamJoin.userInfo.individualById?.actor?.name}
          rounded={AVATAR_USER_ROUNDED}
        />
        <div className="flex flex-col gap-0.5 font-heading">
          <div className="text-1 font-bold text-lg line-clamp-1">{teamJoin.userInfo.individualById?.actor?.name}</div>
          <div className="flex items-center gap-1 text-xs">
            Pour le rôle
            <RoleBadge role={teamJoin.role} className="text-base" />
          </div>
        </div>
      </div>
      {teamJoin.state === ApprovalState.Approved ? (
        <CheckCircleFilledIcon className="w-6 h-6 text-green-400" />
      ) : teamJoin.state === ApprovalState.Rejected ? (
        <CloseCircleFilledIcon className="w-6 h-6 text-red-400" />
      ) : teamJoin.state === ApprovalState.Canceled ? (
        <CanceledFilledIcon className="w-6 h-6 text-slate-600" />
      ) : (
        <TimeOutlinedIcon className="w-6 h-6 text-1" />
      )}
    </div>
  );
}
