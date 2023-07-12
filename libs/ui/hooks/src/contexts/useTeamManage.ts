import { TEAM_MANAGE_SLUG_PARAM } from '@okampus/shared/consts';
import { teamManageInfo, useTypedLazyQuery } from '@okampus/shared/graphql';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useTeamManage() {
  const teamManageSlug = useParams()[TEAM_MANAGE_SLUG_PARAM];
  const [getTeam, { data, error }] = useTypedLazyQuery({
    team: [{ where: { actor: { slug: { _eq: teamManageSlug } } }, limit: 1 }, teamManageInfo],
  });

  useEffect(() => {
    teamManageSlug && getTeam();
  }, [teamManageSlug, useParams]);

  if (!teamManageSlug || error) return { teamManage: undefined, error: 404 }; // TODO: standardize error codes
  return { teamManage: data?.team?.[0], error: undefined };
}
