import { gql } from '../schema/__generated__/gql';

export const getTeamWithMembersBySlugQuery = gql(`
  query getTeamWithMembersBySlug($slug: String!) {
    teamBySlug(slug: $slug) {
      ...TeamMembersInfo
    }
  }
`);
