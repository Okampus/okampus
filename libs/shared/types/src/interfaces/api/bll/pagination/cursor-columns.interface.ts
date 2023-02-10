import type { QueryOrder } from '@mikro-orm/core';

export type CursorColumnTypes = Date | boolean | number | string | null;
export type CursorColumns = Record<string, [value: CursorColumnTypes, order: QueryOrder]>;
