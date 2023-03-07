import type { ActorImageType } from '@okampus/shared/enums';
import type { Individual, TenantCore } from '@okampus/api/dal';
import type { Snowflake } from '@okampus/shared/types';

export class DeactivateUserImageCommand {
  constructor(
    public readonly id: Snowflake,
    public readonly actorImageType: ActorImageType,
    public readonly requester: Individual,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = []
  ) {}
}
