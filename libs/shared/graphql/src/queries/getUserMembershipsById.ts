import { gql } from '../schema/__generated__/gql';

export const getUserMembershipsByIdQuery = gql(`
  query getUserMembershipsById($id: String!) {
    userById(id: $id) {
      ...UserMembershipsInfo
    }
  }
`);
