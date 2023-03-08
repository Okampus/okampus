import { BadRequestException } from '@nestjs/common';
import { GqlCursorTypes, QueryOrder } from '@okampus/shared/enums';
import { enumChecker, isIn } from '@okampus/shared/utils';

import type { BaseEntity } from '@okampus/api/dal';
import type { CursorColumnTypes } from '@okampus/shared/types';

const COL_SEPARATOR = ':';
const METADATA_SEPARATOR = '-';

const columnTypes = {
  string: GqlCursorTypes.String,
  number: GqlCursorTypes.Number,
  date: GqlCursorTypes.Date,
  boolean: GqlCursorTypes.Boolean,
  null: GqlCursorTypes.Null,
};

const serialize = (value: CursorColumnTypes): string => {
  if (value === null) return 'NULL';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'boolean') return Number(value).toString();
  throw new Error(`Cannot serialize value ${JSON.stringify(value)}`);
};

const deserialize = (value: string, type: GqlCursorTypes): CursorColumnTypes => {
  if (type === GqlCursorTypes.Null) return null;
  if (type === GqlCursorTypes.String) return value;
  if (type === GqlCursorTypes.Number) return Number(value);
  if (type === GqlCursorTypes.Date) return new Date(value);
  if (type === GqlCursorTypes.Boolean) return Boolean(Number(value));
  throw new Error(`Cannot deserialize value ${JSON.stringify(value)} to type ${type}`);
};

const isCursorColumnTypes = enumChecker(GqlCursorTypes);
const isQueryOrder = enumChecker(QueryOrder);

function encodeColumn(colName: string, value: CursorColumnTypes, order: QueryOrder): string {
  let colType;
  const type = typeof value;
  if (value === null) colType = GqlCursorTypes.Null;
  else if (value instanceof Date) colType = GqlCursorTypes.Date;
  else if (isIn(type, columnTypes)) colType = columnTypes[type];
  else throw new Error(`Cannot encode column ${colName} with value ${value}`);

  return [colName, colType, Buffer.from(serialize(value)).toString('base64'), order].join(METADATA_SEPARATOR);
}

function decodeColumn(column: string): [name: string, value: CursorColumnTypes, order: QueryOrder] {
  const [colName, colType, value, order] = column.split(METADATA_SEPARATOR);
  if (!isCursorColumnTypes(colType)) throw new Error(`Invalid column type ${colType}`);
  if (!isQueryOrder(order)) throw new Error(`Invalid order ${order}`);
  return [colName, deserialize(Buffer.from(value, 'base64').toString('ascii'), colType), order];
}

export function encodeCursor(columns: Record<string, [value: CursorColumnTypes, order: QueryOrder]>): string {
  return Object.entries(columns)
    .map(([colName, [value, order]]) => encodeColumn(colName, value, order))
    .join(COL_SEPARATOR);
}

export function decodeCursor(cursor: string): Record<string, [value: CursorColumnTypes, order: QueryOrder]> {
  try {
    return Object.fromEntries(
      cursor
        .split(COL_SEPARATOR)
        .map((element) => decodeColumn(element))
        .map(([colName, value, order]) => [colName, [value, order]])
    );
  } catch {
    throw new BadRequestException('Invalid cursor');
  }
}

export function getCursorColumns<T extends BaseEntity>(
  entity: T,
  orderBy: Record<string, QueryOrder>
): Record<string, [value: CursorColumnTypes, order: QueryOrder]> {
  return Object.fromEntries(
    Object.entries(orderBy)
      .map(([colName, order]) => {
        if (isIn(colName, entity)) {
          const value = entity[colName];
          if (typeof value === 'string' && isCursorColumnTypes(value)) {
            return [colName, [value, order]];
          }
        }
        return [];
      })
      .filter((arr) => arr.length > 0)
  );
}

export function makeCursor<T extends BaseEntity>(entity: T, orderBy: Record<string, QueryOrder>): string {
  return encodeCursor(getCursorColumns(entity, orderBy));
}
