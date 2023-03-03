import { Filter } from '@mikro-orm/core';

interface FilterArguments {
  getAll?: boolean;
  getOnlyInactive?: boolean;
}

export const WithActive = (): ClassDecorator => {
  return Filter({
    name: 'active',
    cond: ({ getAll, getOnlyInactive }: FilterArguments = {}) => {
      if (getAll) return {};
      if (getOnlyInactive) return { lastActiveDate: { $ne: null } };
      return { lastActiveDate: null };
    },
    default: true,
  });
};