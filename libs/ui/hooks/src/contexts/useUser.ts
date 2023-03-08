import { useQuery } from '@apollo/client';
import { getFragmentData, getUserBySlugQuery, userMembershipsFragment } from '@okampus/shared/graphql';
import { useParams } from 'react-router-dom';

export function useUser() {
  const { userSlug } = useParams();
  const { data, error } = useQuery(getUserBySlugQuery, { variables: { slug: userSlug ?? '' } });
  if (!userSlug) return { org: undefined, error: 404 }; // TODO: standardize error codes
  return { user: data?.userBySlug ? getFragmentData(userMembershipsFragment, data.userBySlug) : undefined, error };
}
