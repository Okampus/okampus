import { gql } from '../schema/__generated__/gql';

export const getTeamsQuery = gql(`
  query getTeams($options: PaginationOptions, $filter: TeamFilterQuery) {
    teams(options: $options, filter: $filter) {
      edges {
        node {
          ...TeamInfo
        }
      }
    }
  }
`);
