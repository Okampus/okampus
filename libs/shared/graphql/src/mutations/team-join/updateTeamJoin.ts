import { gql } from '../../schema/__generated__/gql';

export const updateTeamJoinMutation = gql(`
  mutation updateTeamJoin($updateTeamJoin: UpdateTeamJoinDto!) {
    updateTeamJoin(updateTeamJoin: $updateTeamJoin) {
      team {
        __typename
        id
        joins {
          ...TeamJoinInfo
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
      joiner {
        __typename
        id
        teamJoins {
          ...TeamJoinInfo
        }
      }
    }
  }
`);
