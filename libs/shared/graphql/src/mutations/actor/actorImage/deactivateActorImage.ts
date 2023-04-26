import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';
import { actorBaseInfo } from '../../../selectors/actor/actorBase';

export const deactivateActorImage = typedGql('mutation')({
  updateActorImageByPk: [
    { pkColumns: { id: $('id', 'String!') }, _set: { lastActiveDate: $('now', 'String!') } },
    {
      __typename: true,
      id: true,
      lastActiveDate: true,
      actor: actorBaseInfo,
    },
  ],
});
