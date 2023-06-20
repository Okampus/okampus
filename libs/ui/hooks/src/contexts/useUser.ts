import { INDIVIDUAL_SLUG_PARAM } from '@okampus/shared/consts';
import { useTypedLazyQuery, userWithMembershipsInfo } from '@okampus/shared/graphql';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useUser() {
  const individualSlug = useParams()[INDIVIDUAL_SLUG_PARAM];
  const [getUser, { data, error }] = useTypedLazyQuery({
    user: [{ where: { individual: { actor: { slug: { _eq: individualSlug } } } }, limit: 1 }, userWithMembershipsInfo],
  });

  useEffect(() => {
    individualSlug && getUser();
  }, [individualSlug, useParams]);

  if (!individualSlug || error) return { user: undefined, error: 404 }; // TODO: standardize error codes
  return { user: data?.user?.[0], error: undefined };
}
