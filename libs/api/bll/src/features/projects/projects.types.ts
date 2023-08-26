import type {
  ProjectInsertInput,
  ProjectOnConflict,
  ProjectSetInput,
  ProjectBoolExp,
  ProjectOrderBy,
  ProjectSelectColumn,
  ProjectPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertProjectArgsType = {
  objects: Array<ProjectInsertInput>;
  onConflict?: ProjectOnConflict;
};

export type InsertOneProjectArgsType = {
  object: ProjectInsertInput;
  onConflict?: ProjectOnConflict;
};

export type UpdateProjectArgsType = {
  where: ProjectBoolExp;
  _set: ProjectSetInput;
};

export type DeleteProjectArgsType = {
  where: ProjectBoolExp;
};

export type DeleteByPkProjectArgsType = {
  id: string;
};

export type UpdateByPkProjectArgsType = {
  pkColumns: ProjectPkColumnsInput;
  _set: ProjectSetInput;
};

export type FindProjectArgsType = {
  where: ProjectBoolExp;
  orderBy?: Array<ProjectOrderBy>;
  distinctOn?: Array<ProjectSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkProjectArgsType = {
  id: string;
};

export type AggregateProjectArgsType = {
  where: ProjectBoolExp;
  orderBy?: Array<ProjectOrderBy>;
  distinctOn?: Array<ProjectSelectColumn>;
  limit?: number;
  offset?: number;
};
