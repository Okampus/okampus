import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { actorImageBaseInfo } from '../../../selectors/actor/actorImage/actorImageBase';
import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertActorImageMutation = typedGql('mutation')({
  insertActorImageOne: [
    { object: $('object', 'ActorImageInsertInput!') as ValueTypes['ActorImageInsertInput'] },
    actorImageBaseInfo,
  ],
});
