import fieldToRelations from '@banksnussman/graphql-fields-to-relations';
import { RequestContext } from '@medibloc/nestjs-request-context';
import type { FullRequestContext } from '@common/lib/classes/full-request-context';

export abstract class GqlFriendlyService {
  public autoGqlPopulate(defaultPopulate?: string[]): readonly never[] {
    const info = RequestContext.get<FullRequestContext>().gqlInfo;
    return info ? fieldToRelations(info) as never[] : defaultPopulate as never[] ?? [];
  }
}
