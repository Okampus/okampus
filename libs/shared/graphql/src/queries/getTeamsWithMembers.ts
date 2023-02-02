import { gql } from '../schema/__generated__/gql';

export const getTeamsWithMembersQuery = gql(`
  query getTeamsWithMembers {
    teams {
      edges {
        node {
          ...TeamMembersInfo
        }
      }
    }
  }
`);
