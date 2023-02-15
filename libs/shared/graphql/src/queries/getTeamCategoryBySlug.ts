import { gql } from '../schema/__generated__/gql';

export const getTeamCategoryBySlugQuery = gql(`
  query getTeamCategoryBySlug($slug: String!) {
    teamCategoryBySlug(slug: $slug) {
      ...TeamCategoryInfo
    }
  }
`);
