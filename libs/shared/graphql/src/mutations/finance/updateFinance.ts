import { gql } from '../../schema/__generated__/gql';

export const updateFinanceMutation = gql(`
  mutation updateFinance($updateFinance: UpdateFinanceDto!) {
    updateFinance(updateFinance: $updateFinance) {
      ...FinanceInfo
    }
  }
`);
