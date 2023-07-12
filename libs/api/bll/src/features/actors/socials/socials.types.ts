import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertSocialArgsType = {
  objects: Array<ValueTypes['SocialInsertInput']>;
  onConflict?: ValueTypes['SocialOnConflict'];
};

export type InsertOneSocialArgsType = {
  object: ValueTypes['SocialInsertInput'];
  onConflict?: ValueTypes['SocialOnConflict'];
};

export type UpdateSocialArgsType = {
  where: ValueTypes['SocialBoolExp'];
  _set: ValueTypes['SocialSetInput'];
};

export type DeleteSocialArgsType = {
  where: ValueTypes['SocialBoolExp'];
};

export type UpdateByPkSocialArgsType = {
  pkColumns: ValueTypes['SocialPkColumnsInput'];
  _set: ValueTypes['SocialSetInput'];
};

export type FindSocialArgsType = {
  where: ValueTypes['SocialBoolExp'];
  orderBy?: Array<ValueTypes['SocialOrderBy']>;
  distinctOn?: Array<ValueTypes['SocialSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkSocialArgsType = {
  id: string;
};

export type AggregateSocialArgsType = {
  where: ValueTypes['SocialBoolExp'];
  orderBy?: Array<ValueTypes['SocialOrderBy']>;
  distinctOn?: Array<ValueTypes['SocialSelectColumn']>;
  limit?: number;
  offset?: number;
};
