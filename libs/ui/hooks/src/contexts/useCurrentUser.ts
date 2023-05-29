import { NavigationContext } from './NavigationContext';
import { userMeInfo, useTypedLazyQuery } from '@okampus/shared/graphql';
import { useContext, useEffect } from 'react';

export function useCurrentUser() {
  const { isLoggedIn } = useContext(NavigationContext);

  const [getCurrentUser, { data, error }] = useTypedLazyQuery({ me: userMeInfo });

  useEffect(() => {
    getCurrentUser();
  }, [isLoggedIn]);

  if (error) return { currentUser: undefined, error: 404 }; // TODO: standardize error codes
  return { currentUser: data?.me, error: undefined };
}
