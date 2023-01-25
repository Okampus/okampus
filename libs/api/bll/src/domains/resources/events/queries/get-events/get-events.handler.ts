import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TenantEventFactory } from '../../../../factories/events/event.factory';
import { PaginatedTenantEventModel } from '../../../../factories/events/event.model';
import { GetEventsQuery } from './get-events.query';

@QueryHandler(GetEventsQuery)
export class GetEventsHandler implements IQueryHandler<GetEventsQuery> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(query: GetEventsQuery): Promise<PaginatedTenantEventModel> {
    return await this.eventFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
