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
    memberCount
    actor {
      __typename
      id
      bio
      name
      slug
      actorImages {
        ...ActorImageBareInfo
      }
      tags {
        __typename
        id
        name
        slug
        color
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
