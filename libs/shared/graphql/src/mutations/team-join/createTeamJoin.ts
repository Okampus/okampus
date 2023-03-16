import { gql } from '../../schema/__generated__/gql';

export const createTeamJoinMutation = gql(`
  mutation createTeamJoin($teamJoin: CreateTeamJoinDto!) {
    createTeamJoin(teamJoin: $teamJoin) {
      team {
        __typename
        id
        joins {
          ...TeamJoinInfo
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
