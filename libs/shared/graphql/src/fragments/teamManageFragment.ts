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
    documents {
      __typename
      id
      type
      document {
        ...DocumentInfo
      }
    }
    finances {
      ...FinanceInfo
    }
  }
`);
