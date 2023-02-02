import { gql } from '../schema/__generated__/gql';

export const projectFragment = gql(`
  fragment ProjectInfo on ProjectModel {
    __typename
    id
    createdAt
    updatedAt
    name
    expectedBudget
    actualBudget
    team {
      ...TeamInfo
    }
    createdBy {
      ...on UserModel {
        ...UserInfo
      }
    }
    supervisor {
      ...UserInfo
    }
    participants {
      ...UserInfo
    }
  }
`);
