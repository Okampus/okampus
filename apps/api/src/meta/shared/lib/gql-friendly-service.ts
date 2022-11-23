import fieldToRelations from '@banksnussman/graphql-fields-to-relations';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { GraphQLResolveInfo } from 'graphql';

export abstract class GqlFriendlyService {
  constructor(@Inject(REQUEST) protected readonly request: Record<string, unknown>) {}

  public autoGqlPopulate(defaultPopulate?: string[]): readonly never[] {
    const info = (this.request?.req as Record<string, unknown>)?.gqlInfo as GraphQLResolveInfo;
    return info ? fieldToRelations(info) as never[] : defaultPopulate as never[] ?? [];
  }
}
