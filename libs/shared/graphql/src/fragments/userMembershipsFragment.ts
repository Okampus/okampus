import { gql } from '../schema/__generated__/gql';

export const userMembershipsFragment = gql(`
  fragment UserMembershipsInfo on UserModel {
    __typename
    id
    createdAt
    updatedAt
    actor {
      __typename
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
    teamMemberships {
      __typename
      id
      createdAt
      updatedAt
      team {
        ...TeamInfo
      }
      roles {
        __typename
        id
        createdAt
        updatedAt
        name
        permissions
        category
        key
      }
    }
  }
`);
