import { gql } from '../schema/__generated__/gql';

export const actorImageBareFragment = gql(`
  fragment ActorImageBareInfo on ActorImageModel {
    __typename
    id
    type
    image {
      __typename
      id
      url
    }
  }
`);
