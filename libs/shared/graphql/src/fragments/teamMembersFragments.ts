import { gql } from '../schema/__generated__/gql';

export const teamMembersFragment = gql(`
  fragment TeamMembersInfo on TeamModel {
    ...TeamInfo
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
  }
`);
