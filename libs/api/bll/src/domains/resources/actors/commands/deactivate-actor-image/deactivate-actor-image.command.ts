import type { TenantCore } from '@okampus/api/dal';
import type { ActorImageType } from '@okampus/shared/enums';
import type { Snowflake } from '@okampus/shared/types';

// TODO: add a delete reason and other metadata?
export class DeactivateActorImageCommand {
  constructor(
    public readonly actorId: Snowflake,
    public readonly actorImageType: ActorImageType,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = []
  ) {}
}
