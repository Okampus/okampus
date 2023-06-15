import { typedGql } from '../../../zeus/typedDocumentNode';
import { id } from '../../id';
import { actorImageBaseInfo } from '../../../selectors/actor/actorImage/actorImageBase';
import { $ } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const deactivateActorImageMutation = typedGql('mutation')({
  updateActorImageByPk: [
    { pkColumns: { id }, _set: { lastActiveDate: $('now', 'timestamptz!') as unknown as string } },
    actorImageBaseInfo,
  ],
});
