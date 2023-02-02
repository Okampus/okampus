import { gql } from '../schema/__generated__/gql';

export const getTeamByIdQuery = gql(`
  query getTeamById($id: String!) {
    teamById(id: $id) {
      ...TeamInfo
    }
  }
`);
