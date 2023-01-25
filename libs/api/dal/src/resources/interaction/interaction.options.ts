import { InteractionProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Actor } from '../actor/actor.entity';
import type { ContentMaster } from '../content-master/content-master.entity';
import { Content } from '../ugc/content/content.entity';

export type InteractionOptions = InteractionProps &
  TenantScopedOptions & {
    content: Content;
    linkedContentMaster?: ContentMaster;
    actor: Actor;
  };
