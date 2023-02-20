/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import type { Snowflake } from '@okampus/shared/types';

type CurrentContextProps = {
  currentUserId: Snowflake | null;
  setCurrentUserId: (user: Snowflake | null) => void;

  currentTenantId: Snowflake | null;
  setCurrentTenantId: (tenant: Snowflake | null) => void;

  currentOrgId: Snowflake | null;
  setCurrentOrgId: (org: Snowflake | null) => void;
};

export const CurrentContext = React.createContext<CurrentContextProps>({
  currentUserId: null,
  setCurrentUserId: () => {},

  currentTenantId: null,
  setCurrentTenantId: () => {},

  currentOrgId: null,
  setCurrentOrgId: () => {},
});
