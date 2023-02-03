import { gql } from '../schema/__generated__/gql';

export const teamCategoryFragment = gql(`
  fragment TeamCategoryInfo on TeamCategoryModel {
    __typename
    id
    createdAt
    updatedAt
    name
    description
    color
    slug
    iconImage {
      __typename
      id
      createdAt
      updatedAt
      url
    }
  }
`);
