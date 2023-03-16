import { gql } from '../schema/__generated__/gql';

export const teamManageFragment = gql(`
  fragment TeamManageInfo on TeamModel {
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
    joins {
      ...TeamJoinInfo
    }
    roles {
      __typename
      id
      name
      color
      required
      permissions
      category
      key
    }
    members {
      __typename
      id
      user {
        __typename
        id
        actor {
          __typename
          id
          name
          actorImages {
            ...ActorImageBareInfo
          }
        }
        firstName
      }
      roles {
        __typename
        id
        name
        color
        required
        permissions
        category
        key
      }
    }
    finances {
      ...FinanceInfo
    }
  }
`);
