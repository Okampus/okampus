import { getFragmentData, teamFragment } from '@okampus/shared/graphql';
import type { TeamMembersInfoFragment } from '@okampus/shared/graphql';

export type LoadedTeamMembersFragment = NonNullable<ReturnType<typeof loadTeamMembersFragment>>;

export function loadTeamMembersFragment(teamMembersFragmentData?: TeamMembersInfoFragment | null) {
  if (!teamMembersFragmentData) return null;
  const teamData = getFragmentData(teamFragment, teamMembersFragmentData);
  return { ...teamData, ...teamMembersFragmentData };
}
