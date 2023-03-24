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
    supervisors {
      __typename
      id
      user {
        __typename
        id
        actor {
          __typename
          id
          name
          actorImages {
            ...ActorImageBareInfo
          }
        }
        firstName
      }
      roles {
        __typename
        id
        name
        color
        required
        permissions
        category
        key
      }
    }
    participants {
      ...UserInfo
    }
  }
`);
