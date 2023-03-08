import { gql } from '../../schema/__generated__/gql';

export const deactivateTeamImageMutation = gql(`
  mutation deactivateTeamImage($id: String!, $actorImageType: ActorImageType!) {
    deactivateTeamImage(id: $id, actorImageType: $actorImageType) {
      __typename
      actor {
        __typename
        id
        name
        slug
        actorImages {
          ...ActorImageBareInfo
        }
      }
    }
  }
`);
