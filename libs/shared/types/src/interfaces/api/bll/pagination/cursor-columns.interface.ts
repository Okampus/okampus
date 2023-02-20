import type { QueryOrder } from '@okampus/shared/enums';

export type CursorColumnTypes = Date | boolean | number | string | null;
export type CursorColumns = Record<string, [value: CursorColumnTypes, order: QueryOrder]>;
