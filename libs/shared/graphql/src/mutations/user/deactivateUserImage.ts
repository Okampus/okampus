import { gql } from '../../schema/__generated__/gql';

export const deactivateUserImageMutation = gql(`
  mutation deactivateUserImage($id: String!, $actorImageType: ActorImageType!) {
    deactivateUserImage(id: $id, actorImageType: $actorImageType) {
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
