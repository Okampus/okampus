import { useLazyQuery } from '@apollo/client';
import { TEAM_SLUG_PARAM } from '@okampus/shared/consts';
import { getFragmentData, getTeamWithMembersBySlugQuery, teamMembersFragment } from '@okampus/shared/graphql';
import { loadTeamMembersFragment } from '@okampus/ui/utils';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useTeam() {
  const [getTeam, { data, error }] = useLazyQuery(getTeamWithMembersBySlugQuery);
  const teamSlug = useParams()[TEAM_SLUG_PARAM];

  useEffect(() => {
    teamSlug && getTeam({ variables: { slug: teamSlug } });
  }, [teamSlug, useParams]);

  if (!teamSlug) return { team: undefined, error: 404 }; // TODO: standardize error codes
  if (!data?.teamBySlug) return { team: undefined, error: error?.message || 404 }; // TODO: standardize error codes

  const teamData = getFragmentData(teamMembersFragment, data.teamBySlug);
  return { team: loadTeamMembersFragment(teamData), error: undefined };
}
