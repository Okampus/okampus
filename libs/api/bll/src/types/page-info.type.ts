import { Field, ObjectType } from '@nestjs/graphql';

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
    startCursor: string | null,
    endCursor: string | null,
    nEdges: number,
    countBefore: number,
    countAfter: number,
    limit: number
  ) {
    this.startCursor = startCursor;
    this.endCursor = endCursor;

    this.hasNextPage = countAfter > 0;
    this.hasPreviousPage = countBefore > 0;

    this.currentPage = Math.floor(countBefore / limit) + 1;

    this.countBefore = countBefore;
    this.countAfter = countAfter;
    this.countCurrent = nEdges;
    this.countTotal = countAfter + countBefore + nEdges;
  }
}
