import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';
import { id } from '../../id';
import { actorImageBaseInfo } from '../../../selectors/actor/actorImage/actorImageBase';

export const deactivateActorImageMutation = typedGql('mutation')({
  updateActorImageByPk: [{ pkColumns: { id }, _set: { lastActiveDate: $('now', 'String!') } }, actorImageBaseInfo],
});
