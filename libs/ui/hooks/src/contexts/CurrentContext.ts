/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import type { Snowflake } from '@okampus/shared/types';

export const CurrentContext = React.createContext({
  currentUserId: null as Snowflake | null,
  setCurrentUserId: (_user: Snowflake | null) => {},

  currentTenantId: null as Snowflake | null,
  setCurrentTenantId: (_tenant: Snowflake | null) => {},

  currentOrgId: null as Snowflake | null,
  setCurrentOrgId: (_org: Snowflake | null) => {},
});
