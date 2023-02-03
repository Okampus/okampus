import { gql } from '../../schema/__generated__/gql';

export const createFinanceMutation = gql(`
  mutation createFinance($finance: CreateFinanceDto!) {
    createFinance(finance: $finance) {
      team {
        __typename
        id
        currentFinance
        finances {
          ...FinanceInfo
        }
      }
    }
  }
`);
