import type { AppAbility } from '@common/modules/casl/casl-ability.factory';

export interface PolicyHandlerObject {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = PolicyHandlerCallback | PolicyHandlerObject;
