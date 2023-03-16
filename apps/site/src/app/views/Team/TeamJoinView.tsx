import { TeamJoinInfoFragment } from '@okampus/shared/graphql';
import { useMe, useTeam } from '@okampus/ui/hooks';

export type TeamJoinViewProps = {
  teamJoin?: TeamJoinInfoFragment;
};

export function TeamJoinView({ teamJoin }: TeamJoinViewProps) {
  const { team } = useTeam();
  const { me } = useMe();

  if (!team || !team.actor || !me) return null;

  return <div className="p-view text-0">TeamJoinView</div>;
}
