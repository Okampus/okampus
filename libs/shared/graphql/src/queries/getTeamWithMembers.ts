import { gql } from '../schema/__generated__/gql';

export const getTeamWithMembersQuery = gql(`
  query getTeamWithMembers($id: String!) {
    teamById(id: $id) {
      ...TeamMembersInfo
    }
  }
`);
