import { gql } from '../schema/__generated__/gql';

export const getUsersQuery = gql(`
  query getUsers($options: PaginationOptions, $filter: UserFilterQuery) {
    users(options: $options, filter: $filter) {
      edges {
        node {
          ...UserMembershipsInfo
        }
      }
    }
  }
`);
