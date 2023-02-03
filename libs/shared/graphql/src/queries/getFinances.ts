import { gql } from '../schema/__generated__/gql';

export const getFinancesQuery = gql(`
  query getFinances($teamId: String!) {
    financesByTeam(teamId: $teamId, options: {}) {
      edges {
        node {
          ...FinanceInfo
        }
      }
    }
  }
`);
