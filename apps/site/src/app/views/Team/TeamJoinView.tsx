import { useMe, useTeam } from '@okampus/ui/hooks';
import type { TeamJoinInfoFragment } from '@okampus/shared/graphql';

export type TeamJoinViewProps = {
  teamJoin?: TeamJoinInfoFragment;
};

export function TeamJoinView({ teamJoin }: TeamJoinViewProps) {
  const { team } = useTeam();
  const { me } = useMe();

  if (!team || !team.actor || !me) return null;

  return (
    <div className="p-view text-0">
      {teamJoin ? (
        <div className="card-sm">État de votre adhésion: {JSON.stringify(teamJoin)}</div>
      ) : (
        <div>Adhérez à l'association!</div>
      )}
    </div>
  );
}
