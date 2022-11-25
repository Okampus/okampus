import fieldToRelations from '@banksnussman/graphql-fields-to-relations';
import { RequestContext } from '@medibloc/nestjs-request-context';
import type { GlobalRequestContext } from '@common/lib/helpers/global-request-context';

export abstract class GqlFriendlyService {
  public autoGqlPopulate(defaultPopulate?: string[]): readonly never[] {
    const info = RequestContext.get<GlobalRequestContext>().gqlInfo;
    // TODO: in case of services querying other services, we should not use the same populate as the base request
    return info ? fieldToRelations(info) as never[] : defaultPopulate as never[] ?? [];
  }
}
