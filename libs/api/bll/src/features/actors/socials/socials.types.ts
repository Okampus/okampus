import type {
  SocialInsertInput,
  SocialOnConflict,
  SocialSetInput,
  SocialBoolExp,
  SocialOrderBy,
  SocialSelectColumn,
  SocialPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertSocialArgsType = {
  objects: Array<SocialInsertInput>;
  onConflict?: SocialOnConflict;
};

export type InsertOneSocialArgsType = {
  object: SocialInsertInput;
  onConflict?: SocialOnConflict;
};

export type UpdateSocialArgsType = {
  where: SocialBoolExp;
  _set: SocialSetInput;
};

export type DeleteSocialArgsType = {
  where: SocialBoolExp;
};

export type UpdateByPkSocialArgsType = {
  pkColumns: SocialPkColumnsInput;
  _set: SocialSetInput;
};

export type FindSocialArgsType = {
  where: SocialBoolExp;
  orderBy?: Array<SocialOrderBy>;
  distinctOn?: Array<SocialSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkSocialArgsType = {
  id: string;
};

export type AggregateSocialArgsType = {
  where: SocialBoolExp;
  orderBy?: Array<SocialOrderBy>;
  distinctOn?: Array<SocialSelectColumn>;
  limit?: number;
  offset?: number;
};
