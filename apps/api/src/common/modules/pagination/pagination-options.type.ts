import type { BaseEntity } from '@common/lib/entities/base.entity';
import type { PaginationArgs } from './pagination-args.type';

export type PaginationOptions<T extends BaseEntity> = PaginationArgs & { cursorColumn?: keyof T };
