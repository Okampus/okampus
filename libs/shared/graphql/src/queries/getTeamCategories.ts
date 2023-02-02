import { gql } from '../schema/__generated__/gql';

export const getTeamCategoriesQuery = gql(`
  query getTeamCategories {
    teamCategories {
      edges {
        node {
          ...TeamCategoryInfo
        }
      }
    }
  }
`);
