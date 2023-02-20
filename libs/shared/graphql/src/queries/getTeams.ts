import { gql } from '../schema/__generated__/gql';

export const getTeamsQuery = gql(`
  query getTeams {
    teams(filter: { types: [Association, Club] }) {
      edges {
        node {
          ...TeamInfo
        }
      }
    }
  }
`);
