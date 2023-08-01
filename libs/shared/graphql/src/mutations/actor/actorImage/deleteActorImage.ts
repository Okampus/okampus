import { typedGql } from '../../../zeus/typedDocumentNode';
import { id } from '../../id';
import { actorImageBaseInfo } from '../../../selectors/actor/actorImage/actorImageBase';

// @ts-ignore
export const deleteActorImageMutation = typedGql('mutation')({
  deleteActorImageByPk: [{ id }, actorImageBaseInfo],
});
