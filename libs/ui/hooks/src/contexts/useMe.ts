import { useQuery } from '@apollo/client';
import { getFragmentData, getMe, meFragment, teamJoinFragment } from '@okampus/shared/graphql';

export function useMe() {
  const { data, error } = useQuery(getMe);
  if (!data || !data.me) return { me: undefined, error };

  const userData = getFragmentData(meFragment, data.me.user);
  return {
    me: {
      ...userData,
      teamJoins: userData.teamJoins.map((teamJoin) => getFragmentData(teamJoinFragment, teamJoin)),
    },
    error: undefined,
  };
}
