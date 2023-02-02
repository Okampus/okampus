/* eslint-disable @typescript-eslint/no-empty-function */
import { Snowflake } from '@okampus/shared/types';
import React from 'react';

export const CurrentContext = React.createContext({
  currentUserId: null as Snowflake | null,
  setCurrentUserId: (_user: Snowflake | null) => {},

  currentTenantId: null as Snowflake | null,
  setCurrentTenantId: (_tenant: Snowflake | null) => {},

  currentOrgId: null as Snowflake | null,
  setCurrentOrgId: (_org: Snowflake | null) => {},
});
