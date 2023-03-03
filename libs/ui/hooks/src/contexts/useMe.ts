import { useQuery } from '@apollo/client';
import { getFragmentData, getMe, meFragment } from '@okampus/shared/graphql';

export function useMe() {
  const { data, error } = useQuery(getMe);
  return { me: data?.me ? getFragmentData(meFragment, data.me.user) : undefined, error };
}
