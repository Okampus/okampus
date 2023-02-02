import { gql } from '../schema/__generated__/gql';

export const teamMembersFragment = gql(`
  fragment TeamMembersInfo on TeamModel {
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
    documents {
      __typename
      id
      type
      document {
        ...DocumentInfo
      }
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
  }
`);
