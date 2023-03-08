import { gql } from '../schema/__generated__/gql';

export const userFragment = gql(`
  fragment UserInfo on UserModel {
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
    status
    roles
    scopeRole
  }
`);
