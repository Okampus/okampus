import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { actorImageBaseInfo } from '../../../selectors/actor/actorImage/actorImageBase';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertActorImageMutation = typedGql('mutation')({
  insertActorImageOne: [
    { object: $('insert', 'ActorImageInsertInput!') as ValueTypes['ActorImageInsertInput'] },
    actorImageBaseInfo,
  ],
});
