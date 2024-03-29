import { NO_TENANT_NAME } from '@okampus/shared/consts';
import { LogContext } from '@prisma/client';

import type { EntityNames } from '@okampus/shared/enums';

export function getS3Key(
  key: string,
  entityName: EntityNames,
  tenantScopeId?: bigint | number | string | null,
  createdById?: bigint | number | string | null,
) {
  return `${tenantScopeId ?? NO_TENANT_NAME}/${entityName}/${createdById ?? LogContext.System}/${key}`;
}
