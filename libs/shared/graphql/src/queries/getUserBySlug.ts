import { gql } from '../schema/__generated__/gql';

export const getUserBySlugQuery = gql(`
  query getUserBySlug($slug: String!) {
    userBySlug(slug: $slug) {
      ...UserMembershipsInfo
    }
  }
`);
