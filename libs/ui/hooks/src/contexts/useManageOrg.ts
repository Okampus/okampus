import { useQuery } from '@apollo/client';
import { getFragmentData, getTeamManageBySlugQuery, teamManageFragment } from '@okampus/shared/graphql';
import { useParams } from 'react-router-dom';

export function useManageOrg() {
  const { manageOrgSlug } = useParams();
  const { data, error } = useQuery(getTeamManageBySlugQuery, { variables: { slug: manageOrgSlug ?? '' } });
  if (!manageOrgSlug) return { manageOrg: undefined, error }; // TODO: standardize error codes
  return { manageOrg: data?.teamBySlug ? getFragmentData(teamManageFragment, data.teamBySlug) : undefined, error };
}
