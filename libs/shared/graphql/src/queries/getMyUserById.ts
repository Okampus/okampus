import { gql } from '../schema/__generated__/gql';

export const getMyUserByIdQuery = gql(`
  query getUserById($id: String!) {
    userById(id: $id) {
      ...MyInfo
    }
  }
`);
