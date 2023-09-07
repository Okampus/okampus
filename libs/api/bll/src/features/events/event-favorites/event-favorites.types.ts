import type {
  EventFavoriteInsertInput,
  EventFavoriteOnConflict,
  EventFavoriteSetInput,
  EventFavoriteBoolExp,
  EventFavoriteOrderBy,
  EventFavoriteSelectColumn,
  EventFavoritePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertEventFavoriteArgsType = {
  objects: Array<EventFavoriteInsertInput>;
  onConflict?: EventFavoriteOnConflict;
};

export type InsertOneEventFavoriteArgsType = {
  object: EventFavoriteInsertInput;
  onConflict?: EventFavoriteOnConflict;
};

export type UpdateEventFavoriteArgsType = {
  where: EventFavoriteBoolExp;
  _set: EventFavoriteSetInput;
};

export type DeleteEventFavoriteArgsType = {
  where: EventFavoriteBoolExp;
};

export type DeleteByPkEventFavoriteArgsType = {
  id: string;
};

export type UpdateByPkEventFavoriteArgsType = {
  pkColumns: EventFavoritePkColumnsInput;
  _set: EventFavoriteSetInput;
};

export type FindEventFavoriteArgsType = {
  where: EventFavoriteBoolExp;
  orderBy?: Array<EventFavoriteOrderBy>;
  distinctOn?: Array<EventFavoriteSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventFavoriteArgsType = {
  id: string;
};

export type AggregateEventFavoriteArgsType = {
  where: EventFavoriteBoolExp;
  orderBy?: Array<EventFavoriteOrderBy>;
  distinctOn?: Array<EventFavoriteSelectColumn>;
  limit?: number;
  offset?: number;
};
