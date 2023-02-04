import { PageInfo } from './page-info.type';
import { Field, ObjectType } from '@nestjs/graphql';
import type { Type } from '@nestjs/common';
import type { AbstractConstructor } from '@okampus/shared/types';
import type { BaseModel } from '../../domains/factories/abstract/base.model';

export interface Edge<Model extends BaseModel> {
  cursor: string | null;
  node: Model;
}

export interface PaginatedNodes<Model extends BaseModel> {
  edges: Array<Edge<Model>>;
  pageInfo: PageInfo | null;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Paginated<Model extends BaseModel>(classRef: Type<Model>): AbstractConstructor<PaginatedNodes<Model>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor!: string;

    @Field(() => classRef)
    node!: Model;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements PaginatedNodes<Model> {
    @Field(() => [EdgeType], { nullable: true })
    edges!: EdgeType[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo!: PageInfo;
  }

  return PaginatedType;
}
