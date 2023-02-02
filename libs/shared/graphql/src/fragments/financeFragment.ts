import { gql } from '../schema/__generated__/gql';

export const financeFragment = gql(`
  fragment FinanceInfo on FinanceModel {
    __typename
    id
    createdAt
    updatedAt
    # description
    # address {
    #   name
    #   street
    #   city
    #   state
    #   zip
    # }
    transaction
    paymentDate
    paymentMethod
    amountDue
    amountPayed
    state
    category
    createdBy {
      ...on UserModel {
        ...UserInfo
      }
    }
    receipts {
      ...DocumentUploadInfo
    }
    linkedEvent {
      ...EventInfo
    }
    linkedProject {
      ...ProjectInfo
    }
  }
`);
