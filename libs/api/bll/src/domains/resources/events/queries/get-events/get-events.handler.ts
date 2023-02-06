import { GetEventsQuery } from './get-events.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantEventFactory } from '../../../../factories/domains/events/event.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { PaginatedTenantEventModel } from '../../../../factories/domains/events/event.model';

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
