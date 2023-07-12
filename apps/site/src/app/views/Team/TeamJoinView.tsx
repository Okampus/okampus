import { useCurrentUser, useTeam } from '@okampus/ui/hooks';

export function TeamJoinView() {
  const { team } = useTeam();
  const { currentUser } = useCurrentUser();

  const currentUserTeamJoin = currentUser?.teamJoins.find((join) => join.team?.id === team?.id);
  if (!currentUserTeamJoin || !team || !team.actor || !currentUser) return null;

  return (
    <div className="text-0">
      {currentUserTeamJoin ? (
        <div className="card-md">État de votre adhésion: {JSON.stringify(currentUserTeamJoin)}</div>
      ) : (
        <div>Adhérez à l'association!</div>
      )}
    </div>
  );
}
