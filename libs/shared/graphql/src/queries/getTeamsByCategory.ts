import { gql } from '../schema/__generated__/gql';

export const getTeamsByCategoryQuery = gql(`
  query getTeamsByCategory($categorySlug: String!) {
    teams(filter: { categories: [$categorySlug], types: [Association, Club] }) {
      edges {
        node {
          ...TeamMembersInfo
        }
      }
    }
  }
`);
