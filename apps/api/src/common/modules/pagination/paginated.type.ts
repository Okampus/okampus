import type { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import type { BaseEntity } from '@common/lib/entities/base.entity';
import type { AbstractConstructor } from '@common/lib/types/types/abstract-constructor.type';
import { PageInfo } from './page-info.type';

export interface Edge<T extends BaseEntity> {
  cursor: string;
  node: T;
}

export interface PaginatedNodes<T extends BaseEntity> {
  edges: Array<Edge<T>>;
  pageInfo: PageInfo;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Paginated<T extends BaseEntity>(classRef: Type<T>): AbstractConstructor<PaginatedNodes<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements PaginatedNodes<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;
  }

  return PaginatedType;
}
