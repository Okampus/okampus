import { gql } from '../schema/__generated__/gql';

export const getTeamDetailsQuery = gql(`
  query getTeamDetails($slug: String!) {
    teamBySlug(slug: $slug) {
      ...TeamMembersInfo
    }
  }
`);
