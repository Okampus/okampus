import type { QueryOrder } from '@mikro-orm/core';
import { GqlCursorTypes } from '../types/enums/gql-cursor-types';

const COL_SEPARATOR = ':';
const METADATA_SEPARATOR = '.';

const columnTypes = {
  string: GqlCursorTypes.String,
  number: GqlCursorTypes.Number,
  date: GqlCursorTypes.Date,
  boolean: GqlCursorTypes.Boolean,
  null: GqlCursorTypes.Null,
};

const serializers = {
  [GqlCursorTypes.String]: (value: string): string => value,
  [GqlCursorTypes.Number]: (value: number): string => value.toString(),
  [GqlCursorTypes.Date]: (value: Date): string => value.toISOString(),
  [GqlCursorTypes.Boolean]: (value: boolean): string => (Number(value)).toString(),
  [GqlCursorTypes.Null]: (): string => 'NULL',
};

const deserializers = {
  [GqlCursorTypes.String]: (value: string): string => value,
  [GqlCursorTypes.Number]: Number,
  [GqlCursorTypes.Date]: (value: string): Date => new Date(value),
  [GqlCursorTypes.Boolean]: (value: string): boolean => Boolean(Number(value)),
  [GqlCursorTypes.Null]: (): null => null,
};

export type CursorColumnTypes = Date | boolean | number | string | null;

function encodeColumn(colName: string, value: CursorColumnTypes, order: QueryOrder): string {
  const colType = value == null
    ? GqlCursorTypes.Null
    : Object.entries(columnTypes).find(([type, _]) => typeof value === type)?.[1];
  if (!colType)
    throw new Error(`Cannot encode column ${colName} with value ${value}`);

  return [colName, colType, Buffer.from(serializers[colType](value as never)).toString('base64'), order]
    .join(METADATA_SEPARATOR);
}

function decodeColumn(column: string): [name: string, value: CursorColumnTypes, order: QueryOrder] {
  const [colName, colType, value, order] = column.split(METADATA_SEPARATOR);
  return [colName, deserializers[colType as GqlCursorTypes](
    Buffer.from(value, 'base64').toString('ascii'),
  ), order as QueryOrder];
}

export function encodeCursor(
  columns: Record<string, [value: CursorColumnTypes, order: QueryOrder]>,
): string {
  return Object.entries(columns)
    .map(([colName, [value, order]]) => encodeColumn(colName, value, order)).join(COL_SEPARATOR);
}

export function decodeCursor(cursor: string): Record<string, [value: CursorColumnTypes, order: QueryOrder]> {
  return Object.fromEntries(cursor.split(COL_SEPARATOR).map(decodeColumn)
    .map(([colName, value, order]) => [colName, [value, order]]));
}
