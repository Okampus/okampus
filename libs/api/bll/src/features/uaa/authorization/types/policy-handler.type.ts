import type { AppAbility } from '../casl/get-abilities';

export interface PolicyHandlerObject {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = PolicyHandlerCallback | PolicyHandlerObject;
