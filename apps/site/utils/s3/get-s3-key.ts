import { NO_TENANT_NAME } from '@okampus/shared/consts';
import { EventContext } from '@okampus/shared/enums';
import type { EntityNames } from '@okampus/shared/enums';

export function getS3Key(
  key: string,
  entityName: EntityNames,
  tenantScopeId?: bigint | string | null,
  createdById?: bigint | string | null,
) {
  return `${tenantScopeId ?? NO_TENANT_NAME}/${entityName}/${createdById ?? EventContext.System}/${key}`;
}
