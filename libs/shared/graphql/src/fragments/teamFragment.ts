import { gql } from '../schema/__generated__/gql';

export const teamFragment = gql(`
  fragment TeamInfo on TeamModel {
    __typename
    id
    createdAt
    updatedAt
    tagline
    type
    currentFinance
    directorsCategoryName
    managersCategoryName
    membersCategoryName
    actor {
      __typename
      id
      name
      slug
      actorImages {
        ...ActorImageBareInfo
      }
    }
    categories {
      ...TeamCategoryInfo
    }
    joinForm {
      ...FormInfo
    }
    documents {
      __typename
      id
      type
      document {
        ...DocumentInfo
      }
    }
  }
`);
