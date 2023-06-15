import { $ } from '../../zeus';
import { id } from '../id';
import { typedGql } from '../../zeus/typedDocumentNode';

import { actorBaseInfo } from '../../selectors/actor/actorBase';
import type { ValueTypes } from '../../zeus';

export const updateActorMutation = typedGql('mutation')({
  updateActorByPk: [
    { pkColumns: { id }, _set: $('update', 'ActorSetInput!') as ValueTypes['ActorSetInput'] },
    actorBaseInfo,
  ],
});
