import { useLazyQuery } from '@apollo/client';
import { USER_SLUG_PARAM } from '@okampus/shared/consts';
import { getFragmentData, getUserBySlugQuery, userMembershipsFragment } from '@okampus/shared/graphql';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useUser() {
  const [getTeam, { data, error }] = useLazyQuery(getUserBySlugQuery);
  const userSlug = useParams()[USER_SLUG_PARAM];

  useEffect(() => {
    userSlug && getTeam({ variables: { slug: userSlug } });
  }, [userSlug, useParams]);

  if (!userSlug) return { user: undefined, error: 404 }; // TODO: standardize error codes
  return {
    user: data?.userBySlug ? getFragmentData(userMembershipsFragment, data.userBySlug) : undefined,
    error,
  };
}
