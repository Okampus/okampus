import { gql } from '../schema/__generated__/gql';

export const meFragment = gql(`
  fragment MyInfo on UserModel {
    __typename
    id
    createdAt
    updatedAt
    actor {
      id
      slug
      name
      bio
      primaryEmail
      ical
      actorImages {
        ...ActorImageBareInfo
      }
    }
    firstName
    lastName
    roles
    scopeRole
    shortcuts {
      __typename
      id
      type
      targetActor {
        __typename
        id
        actorKind
        name
        slug
        actorImages {
          ...ActorImageBareInfo
        }
        individual {
          ... on UserModel {
            ...UserInfo
          }
        }
        org {
          ... on TeamModel {
            ...TeamInfo
          }
        }
      }
    }
  }
`);