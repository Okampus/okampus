import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { ApprovalState } from '@okampus/shared/enums';
import { Avatar, RoleLabel } from '@okampus/ui/atoms';
import { getAvatar } from '@okampus/ui/utils';

import { ReactComponent as PendingFilledIcon } from '@okampus/assets/svg/icons/filled/pending.svg';
import { ReactComponent as ValidateFilledIcon } from '@okampus/assets/svg/icons/filled/validate.svg';
import { ReactComponent as RefuseFilledIcon } from '@okampus/assets/svg/icons/filled/refuse.svg';
import { ReactComponent as CanceledFilledIcon } from '@okampus/assets/svg/icons/filled/cancel.svg';

import type { FormSubmissionInfoFragment, TeamJoinInfoFragment, UserInfoFragment } from '@okampus/shared/graphql';

export type LabeledTeamJoinProps = {
  teamJoin: TeamJoinInfoFragment;
  joiner: UserInfoFragment;
  createdBy: UserInfoFragment | null;
  formSubmission: FormSubmissionInfoFragment | null;
  onClick: () => void;
};

export function LabeledTeamJoin({ teamJoin, joiner, createdBy, formSubmission, onClick }: LabeledTeamJoinProps) {
  return (
    <div className="flex justify-between text-0 p-3 rounded-xl bg-1-hover cursor-pointer " onClick={onClick}>
      <div className="flex gap-item">
        <Avatar
          size={22}
          src={getAvatar(joiner.actor?.actorImages)}
          name={joiner.actor?.name}
          rounded={AVATAR_USER_ROUNDED}
        />
        <div className="flex flex-col gap-0.5 font-heading">
          <div className="text-1 font-bold text-lg line-clamp-1">{joiner.actor?.name}</div>
          <div className="flex items-center gap-1 text-xs">
            Pour le rôle
            <RoleLabel color={teamJoin.askedRole.color} label={teamJoin.askedRole.name} />
          </div>
        </div>
      </div>
      {teamJoin.state === ApprovalState.Approved ? (
        <ValidateFilledIcon className="w-6 h-6 text-green-400" />
      ) : teamJoin.state === ApprovalState.Rejected ? (
        <RefuseFilledIcon className="w-6 h-6 text-red-400" />
      ) : teamJoin.state === ApprovalState.Canceled ? (
        <CanceledFilledIcon className="w-6 h-6 text-slate-600" />
      ) : (
        <PendingFilledIcon className="w-6 h-6 text-1" />
      )}
    </div>
  );
}
