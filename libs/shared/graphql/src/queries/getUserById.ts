import { gql } from '../schema/__generated__/gql';

export const getUserByIdQuery = gql(`
  query getUserById($id: String!) {
    userById(id: $id) {
      ...MyInfo
    }
  }
`);
