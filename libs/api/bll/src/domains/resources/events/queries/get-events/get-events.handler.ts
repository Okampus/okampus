import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { TenantEventFactory } from '../../../../factories/domains/events/event.factory';
import type { PaginatedTenantEventModel } from '../../../../factories/domains/events/event.model';
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
