import { Field, ObjectType } from '@nestjs/graphql';
import type { BaseEntity } from '@common/lib/entities/base.entity';

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true })
  startCursor: string | null;

  @Field(() => String, { nullable: true })
  endCursor: string | null;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Number)
  currentPage: number;

  @Field(() => Number)
  countBefore: number;

  @Field(() => Number)
  countCurrent: number;

  @Field(() => Number)
  countAfter: number;

  @Field(() => Number)
  countTotal: number;

  constructor(
    edges: Array<{ cursor: string; node: BaseEntity }>,
    countBefore: number,
    countAfter: number,
    limit: number,
  ) {
    this.startCursor = edges.length > 0 ? edges[0].cursor : null;
    this.endCursor = edges.length > 0 ? edges.slice(-1)[0].cursor : null;

    this.hasNextPage = countAfter > 0;
    this.hasPreviousPage = countBefore > 0;

    this.currentPage = Math.floor(countBefore / limit) + 1;

    this.countBefore = countBefore;
    this.countAfter = countAfter;
    this.countCurrent = edges.length;
    this.countTotal = countAfter + countBefore + edges.length;
  }
}
