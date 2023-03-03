import { gql } from '../schema/__generated__/gql';

export const getTeamManageBySlugQuery = gql(`
  query getTeamManageBySlug($slug: String!) {
    teamBySlug(slug: $slug) {
      ...TeamManageInfo
    }
  }
`);
