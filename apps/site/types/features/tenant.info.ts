import type { ActorMinimalInfo } from './actor.info';

export type TenantMinimalInfo = {
  id: string;
  domain: string;
  actor: ActorMinimalInfo;
};
