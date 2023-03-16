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
    status
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
    teamJoins {
      ...TeamJoinInfo
    }
    teamMemberships {
      __typename
      id
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
      team {
        __typename
        id
      }
    }
  }
`);
