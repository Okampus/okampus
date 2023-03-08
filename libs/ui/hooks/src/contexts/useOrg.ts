import { useQuery } from '@apollo/client';
import { getFragmentData, getTeamWithMembersBySlugQuery, teamMembersFragment } from '@okampus/shared/graphql';
import { useParams } from 'react-router-dom';

export function useOrg() {
  const { orgSlug } = useParams();
  const { data, error } = useQuery(getTeamWithMembersBySlugQuery, { variables: { slug: orgSlug ?? '' } });
  if (!orgSlug) return { org: undefined, error: 404 }; // TODO: standardize error codes
  return { org: data?.teamBySlug ? getFragmentData(teamMembersFragment, data.teamBySlug) : undefined, error };
}
