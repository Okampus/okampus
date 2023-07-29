import { typedGql } from '../../../zeus/typedDocumentNode';
import { id } from '../../id';
import { actorImageBaseInfo } from '../../../selectors/actor/actorImage/actorImageBase';
import { $ } from '../../../zeus';

// @ts-ignore
export const deactivateActorImageMutation = typedGql('mutation')({
  updateActorImageByPk: [
    { pkColumns: { id }, _set: { deletedAt: $('now', 'timestamptz!') as unknown as string } },
    actorImageBaseInfo,
  ],
});
