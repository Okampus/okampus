import { gql } from '../schema/__generated__/gql';

export const teamJoinFragment = gql(`
  fragment TeamJoinInfo on TeamJoinModel {
      __typename
      id
      createdAt
      updatedAt
      team {
        __typename
        id
      }
      askedRole {
        __typename
        id
        name
        color
        permissions
        category
        key
      }
      formSubmission {
        ...FormSubmissionInfo
      }
      receivedRole {
        __typename
        id
        name
        color
        permissions
        category
        key
      }
      joiner {
        ...UserInfo
      }
      issuer {
        ... on UserModel {
          ...UserInfo
        }
      }
      settledBy {
        ... on UserModel {
          ...UserInfo
        }
      }
      settledAt
      settledMessage
      state
  }
`);
