import { useLazyQuery } from '@apollo/client';
import { TEAM_MANAGE_SLUG_PARAM } from '@okampus/shared/consts';
import { getFragmentData, getTeamManageBySlugQuery, teamManageFragment } from '@okampus/shared/graphql';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useTeamManage() {
  const [getTeam, { data, error }] = useLazyQuery(getTeamManageBySlugQuery);
  const teamManageSlug = useParams()[TEAM_MANAGE_SLUG_PARAM];

  useEffect(() => {
    teamManageSlug && getTeam({ variables: { slug: teamManageSlug } });
  }, [teamManageSlug, useParams]);

  if (!teamManageSlug) return { teamManage: undefined, error: 404 }; // TODO: standardize error codes
  return { teamManage: data?.teamBySlug ? getFragmentData(teamManageFragment, data.teamBySlug) : undefined, error };
}
