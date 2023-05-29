import { TEAM_SLUG_PARAM } from '@okampus/shared/consts';
import { teamWithMembersInfo, useTypedLazyQuery } from '@okampus/shared/graphql';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useTeam() {
  const teamSlug = useParams()[TEAM_SLUG_PARAM];
  const [getTeam, { data, error }] = useTypedLazyQuery({
    team: [{ where: { actor: { slug: { _eq: teamSlug } } }, limit: 1 }, teamWithMembersInfo],
  });

  useEffect(() => {
    teamSlug && getTeam();
  }, [teamSlug, useParams]);

  if (!teamSlug || error) return { team: undefined, error: 404 }; // TODO: standardize error codes
  return { team: data?.team?.[0], error: undefined };
}
